define [
    '../core'
    '../base'
    './item'
    './info'
    './actions'
    'tpl!templates/views/context.html'
    'tpl!templates/views/context-empty.html'
    'tpl!templates/views/context-tree.html'
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

        modelEvents:
            'root:change:enabled': 'toggleState'

        toggleState: ->
            @$el.toggleClass('disabled', not @model.isEnabled())

        onRender: ->
            @toggleState()


    class ContextPanel extends c.Marionette.Layout
        className: 'context'

        template: templates.context

        regions:
            actions: '.actions-region'
            tree: '.tree-region'
            info: '.info-region'

        onRender: ->
            @info.show new info.ContextInfo
                model: @model

            @actions.show new actions.ContextActions
                model: @model

            @tree.show new ContextTree
                model: @model
                collection: @model.root.children


    { ContextPanel }
