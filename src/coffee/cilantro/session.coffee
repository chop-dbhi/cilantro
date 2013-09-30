define [
    'jquery',
    './core'
    './utils'
], ($, c, utils) ->

    channels =
        SESSION_OPENING: 'session.opening'
        SESSION_ERROR: 'session.error'
        SESSION_UNAUTHORIZED: 'session.unauthorized'
        SESSION_OPENED: 'session.opened'
        SESSION_CLOSED: 'session.closed'


    # Changes the first request to authenticate against the server to receive
    # an API token. On success, a subsequent request will be sent to open the
    # session.
    setAuthData = (options, credentials, process, sessionData={}) ->
        success = options.success

        $.extend options,
            type: 'POST'
            contentType: 'application/json'
            data: JSON.stringify(credentials)
            success: (resp) ->
                # Serrano 2.1.0+ does not require a second request
                # TODO remove this success handler in Cilantro 2.1.0
                if resp._links?
                    success(resp)
                else
                    sessionData.token = resp.token
                    openSession(options.url, null, process, sessionData)


    # An explicit `process` handler is used here to ensure the session is
    # setup prior to publishing to the session channels. Most downstream
    # objects depend on the URLs to be accessible.
    openSession = (url, credentials, deferred, sessionData={}) ->
        # TODO remove this success handler in Cilantro 2.1.0. This
        # is needed by the secondary request
        if sessionData.token?
            data = token: sessionData.token

        options =
            url: url
            type: 'GET'
            data: data
            dataType: 'json'

            success: (resp) ->
                $.extend(sessionData, resp)
                deferred.resolve(sessionData)

            error: (xhr, status, error) ->
                deferred.fail(xhr, status, error)

        # If credentials are supplied authorization is assumed to be needed
        if credentials?
            setAuthData(options, credentials, process, sessionData)

        return $.ajax(options)


    # Contains information for an individual session
    class Session
        constructor: (@name, @rootUrl, @crendentials) ->

        # Returns a deferred which will resolve immediately if the session
        # exists. Otherwise, it will be resolved (or failed) when once the
        # request has completed.
        open: ->
            deferred = $.Deferred()
            if @loaded()
                deferred.resolve(@data)
            else
                openSession @rootUrl, @credentials, deferred.done (data) =>
                    @data = data
            return deferred

        loaded: -> @data?

        # Close the session (currently a no-op)
        close: ->

        # Get the URL by reference name in _links, e.g. 'concepts'
        url: (ref) ->
            if not ref then return @rootUrl
            if not (link = @data._links[ref]) then return
            current = utils.linkParser(@data.root)
            target = utils.linkParser(link.href)
            current.pathname = target.pathname
            return current.href


    class SessionManager
        constructor: ->
            @sessions = {}
            @pending = null

        # Handles
        _activate: (session) ->
            # Handle the initial case
            if @current isnt session
                @close()
                @current = session
            c.trigger(channels.SESSION_OPENED, session.name)

        # Opens a session. A name can be supplied for referencing the session
        # rather than by URL. The session will be initialized and registered
        # and marked as the pending session to be opened. On success, the
        # session will be activated.
        open: (name, url, credentials) ->
            # name is always the key, so check existing sessions first
            if not (session = @sessions[name])
                # Shift arguments
                if not url? or typeof url is 'object'
                    credentials = url
                    url = name
                session = new Session(name, url, credentials)

            # Register session and mark is at the pending session
            @pending = @sessions[name] = session

            # If this is the initial session, also set it as the current
            # session.
            if not @current then @current = session

            # Publish the session is opening by the name supplied
            c.trigger channels.SESSION_OPENING, name

            # Open returns a deferred object. If the opened session is *still*
            # the pending session, activate it. This could not be true if the
            # client quickly switches between available sessions and the first
            # session has not yet responded.
            session.open()
                .done =>
                    if @pending is session
                        @_activate(session)
                # Fail will only occur during the first time the session is
                # being opened.
                .fail (xhr, status, error) ->
                    if @pending is session
                        channel = switch xhr.statusCode
                            # Forbidden, unauthorized
                            when 401, 403
                                channels.SESSION_UNAUTHORIZED
                            else
                                channels.SESSION_ERROR
                        c.trigger(channel, name, error)

        # Closes the current sessions and publishes a message
        close: ->
            if (session = @current)?
                delete @current
                session.close()
                c.trigger channels.SESSION_CLOSED, session.name

        # Closes the current session and clears all sessions
        clear: ->
            @close()
            @sessions = {}

        # Proxy for accessing the current session's endpoints.
        url: (ref) ->
            if not @current? then return
            @current.url(ref)


    { SessionManager, channels }
