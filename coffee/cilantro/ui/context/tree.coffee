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
        template: templates.tree

        itemViewContainer: '.branch-children'

        itemView: item.ContextItem

        emptyView: ContextEmptyTree

        modelEvents:
            'change:enabled': 'toggleState'

        toggleState: ->
            @$el.toggleClass('disabled', not @model.isEnabled())

        onRender: ->
            @toggleState()


    class Context extends c.Marionette.Layout
        template: templates.context

        regions:
            info: '.context-info'
            actions: '.context-actions'
            tree: '.context-tree'

        onRender: ->
            @info.show new info.ContextInfo
                model: @model

            @actions.show new actions.ContextActions
                model: @model.root

            @tree.show new ContextTree
                model: @model.root
                collection: @model.root.public.children


    { Context }
