define [
    'underscore'
    'marionette'
    '../base'
    '../core'
    './item'
    './info'
    './actions'
], (_, Marionette, base, c, item, info, actions) ->

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


    class ContextPanel extends Marionette.Layout
        className: 'context'

        template: 'context'

        errorView: base.ErrorOverlayView

        modelEvents:
            sync: 'hideLoadView'
            error: 'showErrorView'
            request: 'showLoadView'

        regions:
            info: '.info-region'
            tree: '.tree-region'
            actions: '.actions-region'

        regionViews:
            info: info.ContextInfo
            tree: ContextTree
            actions: actions.ContextActions

        showLoadView: ->
            @$el.addClass('loading')

        hideLoadView: ->
            @$el.removeClass('loading')

        showErrorView: ->
            # Show an overlay for the whole tree region
            (new @errorView(target: @$el)).render()

        onRender: ->
            @info.show new @regionViews.info
                model: @model

            @actions.show new @regionViews.actions
                model: @model

            @tree.show new @regionViews.tree
                model: @model
                collection: @model.manager.upstream.children


    { ContextPanel }
