define [
    'jquery',
    'underscore'
    'backbone'
    './models'
    './utils'
    './router'
    './core'
], ($, _, Backbone, models, utils, router, c) ->

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
        preview: models.Results
        exporter: models.ExporterCollection
        queries: models.QueryCollection
        public_queries: models.QueryCollection


    ###
    A session opens a connection with a Serrano-compatible API endpoint and
    uses the response to drive the application state. All the necessary data,
    views, router and other state that is specific to a particular endpoint
    is stored here. The lifecycle of a session involves:

        - validating the options
        - requesting the root endpoint of API (with optional authentication)
        - initializing the collections supported by the API
        - fetching the collection data in the background
        - initializing a router and registering top-level routes and views
    ###
    class Session extends models.Model
        idAttribute: 'url'

        initialize: ->
            @opened = false
            @started = false
            @opening = false
            @state = {}

        # Ensure a url is defined when the session is initialized
        # or updated (using set). See http://backbonejs.org/#Model-validate
        # for details.
        validate: (attrs, options) ->
            if not attrs.url?
                return 'url is required'

        startPing: =>
            # Only if the ping endpoint is available
            if @links.ping
                @_ping = setInterval(@ping, 5000)

        stopPing: =>
            clearTimeout(@_ping)

        ping: =>
            Backbone.ajax
                type: 'GET'
                url: @links.ping
                dataType: 'json'
                success: (resp, status, xhr) =>
                    if resp.status is 'timeout'
                        @stopPing()
                        @timeout(resp.location)

                error: (xhr, status, error) =>
                    @stopPing()

                    # Handle redirect
                    if error is 'FOUND'
                        location = xhr.getResponseHeader('Location')
                        @timeout(location)

        timeout: (location) ->
            if location
                message = "Your session timed out. Please \
                          <a href=\"#{ location }\">refresh the page</a>."
            else
                message = 'Your session timed out. Please refresh the page.'

            c.notify
                header: 'Session Timeout'
                message: message
                dismissable: false
                timeout: false
                level: 'warning'

            # Auto-refresh after some time
            setTimeout ->
                if location
                    window.location = location
                else
                    window.location.reload()
            , 5000

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

            # Define router with the main element and app root based on
            # the global configuration
            @router = new router.Router
                main: c.config.get('main')
                root: c.config.get('root')

            # Register pre-defined routes
            if (routes = @get('routes'))?
                # String indicates external module, load and register
                if typeof routes is 'string'
                    require([routes], (routes) => @router.register(routes))
                else
                    if typeof routes is 'function'
                        routes = routes()
                    @router.register(routes)

            return attrs

        # Opens a session. This sends a request to the target URL which is
        # assumed to be the root resource of a Serrano-compatible API. If
        # credentials are supplied, the request will be a POST with the
        # credentials supplied as JSON. A successful response will _ready_
        # the session for use.
        open: ->
            # Session already opened or opening, return a promise
            if @opened or @opening
                return @_opening.promise()

            # Ensure the session is valid before opening
            if not @isValid()
                throw new Error(@validationError)

            # Set state and create deferred that will be used for creating
            # promises while the session is opening and after it is opened
            # to maintain a consistent interface.
            @opening = true
            @_opening = $.Deferred()

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
                    @opening = false
                .done (resp, status, xhr) =>
                    @opened = true
                    @response = resp
                    @_opening.resolveWith(@, [@, resp, status, xhr])
                .fail (xhr, status, error) =>
                    @error = error
                    @_opening.rejectWith(@, [@, xhr, status, error])

            return @_opening.promise()

        # Closing a session will remove the cached data and require it to be
        # opened again.
        # TODO: unload router views?
        close: ->
            @end()
            @opening = @opened = false
            delete @_opening
            delete @response
            # Reset all collections to deference models
            for key, collection of @data
                collection.reset()
            delete @data

        # Starts/enables the session.
        start: (routes, options) ->
            # Already started, return false denoting the start was not successful
            if @started then return false

            if not @opened
                throw new Error('A session must be opened before being loaded')

            @started = true

            # Fetch collection data
            for key, collection of @data
                collection.fetch(reset: true)

            if routes? then @router.register(routes)

            # Start the router history
            @router.start(options)
            @startPing()

            if not c.isSupported(c.getSerranoVersion())
                c.notify
                    header: 'Serrano Version Unsupported'
                    message: 'You are connecting to an unsupported version of Serrano. Some functionality may be broken or missing due to compatibility issues.'
                    level: 'warning'
                    timeout: false

        # Ends/disables the session.
        end: ->
            @started = false
            @stopPing()
            @router.unregister()


    # Keeps track of sessions as they are created and switched between.
    # The `pending` property references any session that is currently loading and will be
    # made the active once finished. The `active` property references the
    # currently active session if one exists.
    class SessionManager extends Backbone.Collection
        _switch: (session) ->
            if @active is session
                return
            delete @pending
            # End the current active session
            @close()
            # Set session as active and start it
            @active = session
            @trigger(events.SESSION_OPENED, session)

        # Opens a session. Takes an object of options that are passed into
        # the session constructor. The url can be passed by itself as the
        # first argument as a shorthand method for opening sessions.
        open: (url, options) ->
            if typeof url is 'object'
                options = url
            else
                options ?= {}
                options.url = url

            # Get or create the session
            if not (session = @get(options.url))
                session = new Session(options)
                @add(session)

            # Ensure redundant calls are not being made
            if session isnt @active and session isnt @pending
                @pending = session
                @trigger(events.SESSION_OPENING, session)

            # Open returns a deferred object. If the opened session is *still*
            # the pending session, activate it. This could not be true if the
            # client quickly switches between available sessions and the first
            # session has not yet responded.
            return session.open()
                .done =>
                    if @pending isnt session then return
                    @_switch(session)
                .fail (_session, xhr, status, error) =>
                    if @pending isnt session then return
                    @pending = null
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
            if (session = @active)?
                delete @active
                session.close()
                @trigger(events.SESSION_CLOSED, session)

        # Closes the current session and clears all sessions
        clear: ->
            @close()
            @reset()


    _.extend { SessionManager, Session }, events
