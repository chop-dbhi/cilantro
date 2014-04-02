/* global define */

define([
    'marionette',
    '../core',
    '../concept'
], function(Marionette, c, concept) {

    /*
    The QueryWorkflow provides an interface for navigating and viewing
    concepts that are deemed 'queryable'. This includes browsing the
    available concepts in the index, viewing details about the
    concept in the workspace as well as adding or modifying filters,
    and viewing the list of filters in the context panel.

    This view requires the following options:
    - concepts: a collection of concepts that are deemed queryable
    - context: the session/active context model
    */
    var QueryWorkflow = Marionette.Layout.extend({
        className: 'query-workflow',

        template: 'workflows/query',

        regions: {
            workspace: '.concept-workspace-region'
        },

        regionViews: {
            workspace: concept.ConceptWorkspace
        },

        initialize: function() {
            this.data = {};

            if (!(this.data.context = this.options.context)) {
                throw new Error('context model required');
            }

            if (!(this.data.concepts = this.options.concepts)) {
                throw new Error('concept collection required');
            }

            // Ensure the necessary panels are toggled
            this.on('router:load', function() {
                c.panels.concept.openPanel();
                c.panels.context.openPanel();
            });

            this.on('router:unload', function() {
                c.panels.concept.closePanel();
            });
        },

        onRender: function() {
            var workspace = new this.regionViews.workspace({
                context: this.data.context,
                concepts: this.data.concepts
            });

            this.workspace.show(workspace);
        }
    });


    return {
        QueryWorkflow: QueryWorkflow
    };

});
