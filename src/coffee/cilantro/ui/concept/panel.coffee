define [
    'underscore'
    'marionette'
    './index'
    './search'
    'tpl!templates/concept/panel.html'
], (_, Marionette, index, search, templates...) ->

    templates = _.object ['panel'], templates

    # Takes a collection of c.models.ConceptModel objects
    class ConceptPanel extends Marionette.Layout
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
            @search.show new search.ConceptSearch
                collection: @collection

                handler: (query, resp) =>
                    @index.currentView.filter(query, resp)

            # Defer focus of concept search until end of event loop
            _.defer => @search.currentView.ui.input.focus()

    { ConceptPanel }
