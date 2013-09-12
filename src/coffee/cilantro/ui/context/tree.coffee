define [
    '../core'
    '../base'
    './item'
    './info'
    './actions'
    'tpl!templates/context.html'
    'tpl!templates/context/empty.html'
    'tpl!templates/context/tree.html'
], (c, base, item, info, actions, templates...) ->

    templates = c._.object ['context', 'empty', 'tree'], templates


    class ContextEmptyTree extends base.EmptyView
        template: templates.empty


    class ContextTree extends c.Marionette.CompositeView
        className: 'context-tree'

        template: templates.tree

        itemViewContainer: '.branch-children'

        itemView: item.ContextItem

        emptyView: ContextEmptyTree


    class ContextPanel extends c.Marionette.Layout
        className: 'context'

        template: templates.context

        regions:
            actions: '.actions-region'
            tree: '.tree-region'
            info: '.info-region'

        modelEvents:
            'request': 'showLoading'
            'sync': 'doneLoading'
            'error': 'doneLoading'

        initialize: ->
            @listenTo(@model, 'request', @showLoading, @)
            @listenTo(@model, 'sync', @doneLoading, @)

        onRender: ->
            @info.show new info.ContextInfo
                model: @model

            @actions.show new actions.ContextActions
                model: @model

            @tree.show new ContextTree
                model: @model
                collection: @model.manager.upstream.children

        showLoading: ->
            @$el.addClass 'loading'

        doneLoading: ->
            @$el.removeClass 'loading'

    { ContextPanel }
