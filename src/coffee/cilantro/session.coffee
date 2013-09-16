define [
    'jquery',
    'underscore'
    'backbone'
    './models'
    './utils'
    './router'
], ($, _, Backbone, models, utils, router) ->

    events =
        SESSION_OPENING: 'session:opening'
        SESSION_ERROR: 'session:error'
        SESSION_UNAUTHORIZED: 'session:unauthorized'
        SESSION_OPENED: 'session:opened'
        SESSION_CLOSED: 'session:closed'


    # Mapping of Serrano resource links to corresponding collections or models.
    collectionLinkMap =
        concepts: models.ConceptCollection
        fields: models.FieldCollection
        contexts: models.ContextCollection
        views: models.ViewCollection
        results: models.Results
        exporters: models.ExporterCollection
        queries: models.QueryCollection
        sharedQueries: models.QueryCollection


    # A session opens a connection with a Serrano-compatible API endpoint and
    # uses the response to drive the application state. All the necessary data,
    # views, router and other state that is specific to a particular endpoint
    # is stored here. The lifecycle of a session involves:
    #
    #   - validating the options
    #   - requesting the root endpoint of API (with optional authentication)
    #   - initializing the collections supported by the API
    #   - fetching the collection data in the background
    #   - initializing a router and registering top-level routes and views
    class Session extends models.Model
        idAttribute: 'url'

        initialize: ->
            @opened = false
            @started = false
            @loading = false

        validate: (attrs, options) ->
            if not attrs.url? then true

        parse: (attrs) ->
            # Title of the API
            @title = attrs.title

            # Version of the API
            @version = attrs.version

            # Iterate over the available resource links and initialize
            # the corresponding collection with the URL
            @data = {}

            for name, link of attrs._links
                if (Collection = collectionLinkMap[name])
                    collection = new Collection
                    collection.url = link.href
                    @data[name] = collection

            # Define the primary router with the main element and app root
            @router = new router.Router
                el: @get('main')
                root: @get('root')

            # Register pre-defined routes
            if (routes = @get('routes'))?
                # String indicates external module, load and register
                if typeof routes is 'string'
                    require([routes], (routes) => @register(routes))
                else
                    if typeof routes is 'function'
                        routes = routes()
                    @register(routes)

            return attrs

        # Opens a session. This sends a request to the target URL which is
        # assumed to be the root resource of a Serrano-compatible API. If
        # credentials are supplied, the request will be a POST with the
        # credentials supplied as JSON. A successful response will _ready_
        # the session for use.
        open: ->
            @loading = true

            options =
                url: @get('url')
                type: 'GET'
                dataType: 'json'

            # If credentials switch to POST and add the credentials
            if (credentials = @get('credentials'))?
                $.extend options,
                    type:  'POST'
                    contentType: 'application/json'
                    data: JSON.stringify(credentials)

            @fetch(options)
                .always =>
                    @loading = false
                .done (resp, status, xhr) =>
                    @opened = true
                    @response = resp
                .fail (xhr, status, error) =>
                    @error = err

        # Closing a session will remove the cached data and require it to be
        # opened again.
        # TODO: unload router views?
        close: ->
            @loading = @started = @opened = false
            delete @response
            # Reset all collections to deference models
            for key, collection of @data
                collection.reset()
            delete @data

        # Starts/enables the session.
        start: ->
            # Already started, return false denoting the start was not successful
            if @started then return false

            if not @opened
                throw new Error('A session must be opened before being loaded')

            @started = true

            # Fetch collection data
            for key, collection of @data
                collection.fetch()

            # Start the router history
            @router.start()

        # Ends/disables the session.
        end: ->
            @started = false


    # Keeps track of sessions as they are created and switched between.
    # The `pending` property references any session that is currently loading and will be
    # made the active once finished. The `active` property references the
    # currently active session if one exists.
    class SessionManager extends Backbone.Collection
        switch: (session) ->
            delete @pending
            if @active?
                @active.end()
                @trigger(events.SESSION_CLOSED, session)
            @active = session
            @active.start()
            @trigger(events.SESSION_OPENED, session)

        # Opens a session. The options are the session configuration options
        # and must contain at least a `url` for referencing and opening the
        # session.
        open: (url, options) ->
            if typeof url is 'object'
                options = url
            else
                options ?= {}
                options.url = url
            # name is always the key, so check existing sessions first
            if not (session = @get(options.url))
                session = new Session(options)
                @add(session)

            # Set the session as the pending session
            @pending = @get(options.url)

            # Publish the session is opening by the name supplied
            @trigger(events.SESSION_OPENING, session)

            # If this session is already open, immediately switch it
            if session.opened
                @switch(session)
                $.Deferred().resolveWith(session)
            else
                # Open returns a deferred object. If the opened session is *still*
                # the pending session, activate it. This could not be true if the
                # client quickly switches between available sessions and the first
                # session has not yet responded.
                session.open()
                    .done =>
                        if @pending is session then @switch(session)
                    .fail (xhr, status, error) =>
                        # Select to the appropriate channel to publish on depending
                        # if it's a forbidden, unauthorized, or general error
                        event = switch xhr.statusCode
                            when 401, 403
                                events.SESSION_UNAUTHORIZED
                            else
                                events.SESSION_ERROR
                        @trigger(event, session, error)

        # Closes the current sessions and publishes a message
        close: ->
            if (session = @current)?
                delete @current
                session.close()

        # Closes the current session and clears all sessions
        clear: ->
            @close()
            @reset()

        # Proxy for accessing the current session's endpoints.
        url: (ref) ->
            if not @current? then return
            @current.url(ref)

        # Give the session manager events
        _.extend(SessionManager::, Backbone.Events)


    { SessionManager, Session, events }
