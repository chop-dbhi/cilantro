/* global define */

define([
    'marionette',
    '../core',
    '../query'
], function(Marionette, c, query) {

    var WorkspaceWorkflow = Marionette.Layout.extend({
        className: 'workspace-workflow',

        template: 'workflows/workspace',

        regions: {
            queries: '.query-region',
            publicQueries: '.public-query-region',
        },

        regionViews: {
            queries: query.QueryList,
            publicQueries: query.QueryList
        },

        initialize: function() {
            this.data = {};

            if (c.isSupported('2.2.0')) {
                if (!(this.data.publicQueries = this.options.public_queries)) {  // jshint ignore:line
                    throw new Error('public queries collection required');
                }
            }

            if (!(this.data.queries = this.options.queries)) {
                throw new Error('queries collection required');
            }

            if (!(this.data.context = this.options.context)) {
                throw new Error('context model required');
            }

            if (!(this.data.view = this.options.view)) {
                throw new Error('view model required');
            }

            // When this workflow is loaded, toggle shared components
            this.on('router:load', function() {
                // Fully hide the panel; do not leave an edge to show/hide
                c.panels.context.closePanel({full: true});
                c.panels.concept.closePanel({full: true});
            });
        },

        onRender: function() {
            var queryView = new this.regionViews.queries({
                collection: this.data.queries,
                context: this.data.context,
                view: this.data.view,
                editable: true
            });

            this.queries.show(queryView);

            if (c.isSupported('2.2.0')) {
                var publicQueryView = new this.regionViews.publicQueries({
                    collection: this.data.publicQueries,
                    context: this.data.context,
                    view: this.data.view,
                    title: 'Public Queries',
                    emptyMessage: "There are no public queries. You can create a " +
                                  "new, public query by navigating to the 'Results'" +
                                  "page and clicking on the 'Save Query...' button. " +
                                  "While filling out the query form, you can mark " +
                                  "the query as public which will make it visible " +
                                  "to all users and cause it to be listed here."
                });

                // We explicitly set the editable option to false below because
                // users should not be able to edit the public queries
                // collection.
                this.publicQueries.show(publicQueryView);

                // When the queries are synced we need to manually update the
                // public queries collection so that any changes to public
                // queries are reflected there. Right now, this is done lazily
                // rather than checking if the changed model is public or had
                // its publicity changed. If this becomes too slow we can
                // perform these checks but for now this is snappy enough.
                this.listenTo(this.data.queries, 'sync', function() {
                    this.data.publicQueries.fetch({reset: true});
                });

            }

            this.listenTo(c.data.concepts, 'reset', function() {
                this.queries.show(queryView);

                if (this.publicQueries) {
                    this.publicQueries.show(publicQueryView);
                }
            });
        }
    });


    return {
        WorkspaceWorkflow: WorkspaceWorkflow
    };

});
