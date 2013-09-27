define [
    'underscore'
    '../core'
    '../structs'
    './paginator'
], (_, c, structs, paginator) ->


    class ResultsPage extends structs.Frame
        idAttribute: 'page_num'

        url: ->
            url = _.result(@collection, 'url')
            c.utils.alterUrlParams(url, 'page', @id, 'per_page', @collection.perPage)


    # Array of result frames (pages). The first fetch sets the state
    # of the collection including the frame size, number of possible
    # frames, etc. A refresh resets the collection as well as changes
    # to the frame size.
    class Results extends structs.FrameArray
        initialize: ->
            # Debounce refresh to ensure changes are reflected up to the last
            # trigger. This is specifically important when the context and view
            # are saved simultaneously. The refresh will trigger after the
            # second
            @_refresh = _.debounce(_.bind(@refresh, @), 500)

            c.on(c.VIEW_SYNCED, @_refresh)
            c.on(c.CONTEXT_SYNCED, @_refresh)

        fetch: (options={}) ->
            options.cache ?= false
            super(options)


    # Mix-in paginator functionality for results
    _.extend Results::, paginator.PaginatorMixin

    # Set the custom model for this Paginator
    Results::model = ResultsPage


    { Results }
