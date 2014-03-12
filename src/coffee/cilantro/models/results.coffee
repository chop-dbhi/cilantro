define [
    'underscore'
    '../core'
    '../constants'
    '../structs'
    './paginator'
], (_, c, constants, structs, paginator) ->


    class ResultsPage extends structs.Frame
        idAttribute: 'page_num'

        url: ->
            url = _.result(@collection, 'url')
            c.utils.alterUrlParams url,
                page: @id
                per_page: @collection.perPage


    # Array of result frames (pages). The first fetch sets the state
    # of the collection including the frame size, number of possible
    # frames, etc. A refresh resets the collection as well as changes
    # to the frame size.
    class Results extends structs.FrameArray
        initialize: ->
            # We start in a dirty state because initially, we have not
            # retrieved the results yet so the view and context are
            # technically out of sync with this results collection since the
            # collection is empty and the server may have results.
            @isDirty = true
            @isWorkspaceOpen = false

            # Debounce refresh to ensure changes are reflected up to the last
            # trigger. This is specifically important when the context and view
            # are saved simultaneously. The refresh will trigger after the
            # second
            @_refresh = _.debounce(_.bind(@refresh, @), constants.CLICK_DELAY)

            c.on(c.VIEW_SYNCED, @markAsDirty)
            c.on(c.CONTEXT_SYNCED, @markAsDirty)

            @on 'workspace:load', @onWorkspaceLoad
            @on 'workspace:unload', @onWorkspaceUnload

        onWorkspaceLoad: =>
            @isWorkspaceOpen = true
            @_refresh()

        onWorkspaceUnload: =>
            @isWorkspaceOpen = false

        markAsDirty: =>
            @isDirty = true
            @_refresh()

        fetch: (options={}) =>
            if (data = c.config.get('session.defaults.data.preview'))?
                options.type = 'POST'
                options.contentType = 'application/json'
                options.data = JSON.stringify(data)

            if @isDirty and @isWorkspaceOpen
                # Since we are making the fetch call immediately below, the
                # data will be synced again to the current view/context to
                # mark the results as clean for the time being.
                @isDirty = false
                options.cache ?= false
                return super(options)
            # If the results aren't dirty or the workspace isn't open then
            # we simply abort this fetch call and remove the pending flag. If
            # we do not include this done method then calls from refresh() to
            # fetch that don't actually result in a call to the server will
            # never call the done() handler in the refresh() call to fetch()/
            else
                done: => delete @pending

    # Mix-in paginator functionality for results
    _.extend Results::, paginator.PaginatorMixin

    # Set the custom model for this Paginator
    Results::model = ResultsPage


    { Results }
