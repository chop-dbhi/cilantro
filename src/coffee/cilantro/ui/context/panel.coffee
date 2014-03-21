define [
    'underscore'
    'marionette'
    '../base'
    '../core'
    './tree'
    './info'
    './actions'
], (_, Marionette, base, c, tree, info, actions) ->


    class ContextPanel extends Marionette.Layout
        id: 'context-panel'

        className: 'panel panel-right closed'

        template: 'context/panel'

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
            tree: tree.ContextTree
            actions: actions.ContextActions

        showLoadView: ->
            @$el.addClass('loading')

        hideLoadView: ->
            @$el.removeClass('loading')

        showErrorView: ->
            # Show an overlay for the whole tree region
            (new @errorView(target: @$el)).render()

        onRender: ->
            # Initialize panel to set default state
            @$el.panel()

            @info.show new @regionViews.info
                model: @model

            @actions.show new @regionViews.actions
                model: @model

            @tree.show new @regionViews.tree
                model: @model
                collection: @model.manager.upstream.children

        openPanel: (options) ->
            @$el.panel('open', options)

        closePanel: (options) ->
            @$el.panel('close', options)

        isPanelOpen: (options) ->
            @$el.data('panel').isOpen(options)

        isPanelClosed: (options) ->
            @$el.data('panel').isClosed(options)


    { ContextPanel }
