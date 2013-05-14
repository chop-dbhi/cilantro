define [
    '../core'
    './index'
    './search'
    'tpl!templates/views/concept-panel.html'
], (c, index, search, templates...) ->

    templates = c._.object ['panel'], templates


    class ConceptPanel extends c.Marionette.Layout
        template: templates.panel

        regions:
            search: '.concept-search'
            index: '.concept-index'

        onRender: ->
            @search.show new search.ConceptSearch
                collection: @collection

            @index.show new index.ConceptIndex
                collection: @collection


    { ConceptPanel }
