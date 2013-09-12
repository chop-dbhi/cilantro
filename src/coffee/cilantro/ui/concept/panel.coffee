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


    # Takes a collection of c.models.ConceptModel objects
    class ConceptPanel extends c.Marionette.Layout
        className: 'concept-panel'

        template: templates.panel

        # Two primary regions for the concept panel including the search
        # and the index (listing) of concepts
        regions:
            search: '.search-region'
            index: '.index-region'

        onRender: ->
            # Pass the collection of concepts to be rendered in the index
            @index.show new index.ConceptIndex
                collection: @collection
                collapsable: false

            # When a search occurs, the index is filtered relative to the
            # response which contains a listing of IDs that the search
            # has matched.
            @search.show new ConceptSearch
                collection: @collection
                handler: (query, resp) =>
                    @index.currentView.filter(query, resp)

            # Defer focus of concept search until end of event loop
            c._.defer =>
                @search.currentView.ui.input.focus()


    { ConceptPanel }
