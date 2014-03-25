/* global define */

define([
    'underscore',
    'marionette',
    '../core'
], function(_, Marionette, c) {

    var QueryLoader = Marionette.ItemView.extend({
        className: 'query-loader',

        template: 'query/loader',

        ui: {
            loadingMessage: '.loading-message',
            errorMessage: '.error-message'
        },

        initialize: function() {
            this.data = {};

            if (!(this.data.context = this.options.context)) {
                throw new Error('context model required');
            }

            if (!(this.data.view = this.options.view)) {
                throw new Error('view model required');
            }

            if (!(this.data.queries = this.options.queries)) {
                throw new Error('queries collection required');
            }

            this.on('router:load', this.onRouterLoad);
            this.listenTo(this.data.queries, 'sync', this.loadRequestedQuery);
        },

        onRouterLoad: function(router, fragment, id) {
            this.requestedQueryId = parseInt(id) || null;
        },

        loadRequestedQuery: function() {
            if (this.requestedQueryId) {
                var query = this.data.queries.get(this.requestedQueryId);

                delete this.requestedQueryId;

                if (query) {
                    this.data.view.save('json', query.get('view_json'));
                    this.data.context.save('json', query.get('context_json'), {
                        reset: true
                    });
                    c.router.navigate('results', {trigger: true});
                } else {
                    this.ui.loadingMessage.hide();
                    this.ui.errorMessage.show();
                }
            }
        }
    });

    return {
        QueryLoader: QueryLoader
    };

});
