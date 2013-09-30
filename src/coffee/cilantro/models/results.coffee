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
        url: ->
            c.session.url('preview')

        initialize: ->
            c.on c.SESSION_OPENED, @refresh, @
            c.on c.SESSION_CLOSED, @reset, @
            c.on c.CONTEXT_SYNCED, @refresh, @
            c.on c.VIEW_SYNCED, @refresh, @

        fetch: (options={}) ->
            options.cache ?= false
            super(options)

    _.extend Results::, paginator.PaginatorMixin

    # Set the custom model for this Paginator
    Results::model = ResultsPage


    { Results }
