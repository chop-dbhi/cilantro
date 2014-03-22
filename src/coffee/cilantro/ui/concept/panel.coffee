define [
    'underscore'
    'marionette'
    './index'
    './search'
], (_, Marionette, index, search) ->

    class ConceptPanel extends Marionette.Layout
        id: 'concept-panel'

        className: 'panel panel-left closed'

        template: 'concept/panel'

        # Two primary regions for the concept panel including the search
        # and the index (listing) of concepts
        regions:
            search: '.search-region'
            index: '.index-region'

        ui:
            noSearchResults: '.no-search-results'

        onRender: ->
            # Initialize panel to set default state
            @$el.panel()

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

            # Pass the collection of concepts to be rendered in the index
            @index.show new index.ConceptIndex
                collection: @collection

        openPanel: (options) ->
            @$el.panel('open', options)

        closePanel: (options) ->
            @$el.panel('close', options)

        isPanelOpen: (options) ->
            @$el.data('panel').isOpen(options)

        isPanelClosed: (options) ->
            @$el.data('panel').isClosed(options)


    { ConceptPanel }
