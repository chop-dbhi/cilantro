define [
    '../core'
    './item'
    'tpl!templates/views/context.html'
], (c, item, templates...) ->

    templates = c._.object ['tree'], templates

    class Context extends c.Marionette.CollectionView
        template: templates.tree

        itemView: item.ContextNode


    { Context }
