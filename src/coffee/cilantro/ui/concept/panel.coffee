define [
    'underscore'
    'marionette'
    './index'
    './search'
], (_, Marionette, index, search) ->

    class ConceptPanel extends Marionette.Layout
        className: 'concept-panel'

        template: 'concept/panel'

        # Two primary regions for the concept panel including the search
        # and the index (listing) of concepts
        regions:
            search: '.search-region'
            index: '.index-region'

        ui:
            noSearchResults: '.no-search-results'

        onRender: ->
            # Pass the collection of concepts to be rendered in the index
            @index.show new index.ConceptIndex
                collection: @collection

            # When a search occurs, the index is filtered relative to the
            # response which contains a listing of IDs that the search
            # has matched.
            @ui.noSearchResults.hide()
            @search.show new search.ConceptSearch
                collection: @collection

                handler: (query, resp) =>
                    if @index.currentView.filter(query, resp)
                        @ui.noSearchResults.hide()
                    else
                        @ui.noSearchResults.show()

            # Defer focus of concept search until end of event loop
            _.defer => @search.currentView.ui.input.focus()

    { ConceptPanel }
