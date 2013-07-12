define [
    '../core'
    './index'
    './search'
    'tpl!templates/concept/panel.html'
], (c, index, search, templates...) ->

    templates = c._.object ['panel'], templates


    class ConceptSearch extends search.ConceptSearch
        events:
            'typeahead:autocompleted input': 'autocomplete'

        autocomplete: (event, datum) ->
            c.publish c.CONCEPT_FOCUS, datum.id


    class ConceptPanel extends c.Marionette.Layout
        className: 'concept-panel'

        template: templates.panel

        regions:
            search: '.search-region'
            index: '.index-region'

        onRender: ->
            @index.show new index.ConceptIndex
                collection: @collection
                collapsable: false

            @search.show new ConceptSearch
                collection: @collection
                handler: (query, resp) =>
                    @index.currentView.filter(query, resp)

            # Defer focus of concept search until end of event loop
            c._.defer =>
                @search.currentView.ui.input.focus()


    { ConceptPanel }
