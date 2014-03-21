define [
    'marionette'
    '../base'
    '../core'
    './item'
], (Marionette, base, c, item) ->

    class ContextEmptyTree extends base.EmptyView
        template: 'context/empty'

        ui:
            noFiltersResultsMessage: '.no-filters-results-workspace'
            noFiltersQueryMessage: '.no-filters-query-workspace'

        onRender: ->
            if c.router.isCurrent('results')
                @ui.noFiltersQueryMessage.hide()
            else if c.router.isCurrent('query')
                @ui.noFiltersResultsMessage.hide()


    class ContextTree extends Marionette.CompositeView
        className: 'context-tree'

        template: 'context/tree'

        itemViewContainer: '.branch-children'

        itemView: item.ContextItem

        emptyView: ContextEmptyTree


    { ContextTree, ContextEmptyTree }
