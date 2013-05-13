define [
    '../core'
    './item'
    './actions'
    '../empty'
    'tpl!templates/views/context.html'
    'tpl!templates/views/context-empty.html'
    'tpl!templates/views/context-tree.html'
], (c, item, actions, empty, templates...) ->

    templates = c._.object ['context', 'empty', 'tree'], templates


    class ContextEmptyTree extends empty.EmptyView
        template: templates.empty


    class ContextTree extends c.Marionette.CompositeView
        template: templates.tree

        itemViewContainer: '.branch-children'

        itemView: item.ContextNode

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
            actions: '.context-actions'
            tree: '.context-tree'

        onRender: ->
            @actions.show new actions.ContextActions
                model: @model.root

            @tree.show new ContextTree
                model: @model.root
                collection: @model.root.children


    { Context }
