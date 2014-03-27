/* global define */

define([
    'marionette',
    '../base',
    '../core',
    './item'
], function(Marionette, base, c, item) {


    var ContextEmptyTree = base.EmptyView.extend({
        template: 'context/empty',

        ui: {
            noFiltersResultsMessage: '.no-filters-results-workspace',
            noFiltersQueryMessage: '.no-filters-query-workspace'
        },

        onRender: function() {
            if (c.router.isCurrent('results')) {
                this.ui.noFiltersQueryMessage.hide();
            }
            else if (c.router.isCurrent('query')) {
                this.ui.noFiltersResultsMessage.hide();
            }
        }
    });


    var ContextTree = Marionette.CompositeView.extend({
        className: 'context-tree',

        template: 'context/tree',

        itemViewContainer: '.branch-children',

        itemView: item.ContextItem,

        emptyView: ContextEmptyTree
    });


    return {
        ContextTree: ContextTree,
        ContextEmptyTree: ContextEmptyTree
    };


});
