define [
    'jquery',
    'mediator'
    './utils'
    './session/channels'
], ($, mediator, utils, channels) ->

    # Get a URL by name for the current session relative to some hostname
    getSessionUrl = (session, key) ->
        if not session? then return
        if not (link = session.urls[key]) then return
        current = utils.linkParser(session.root)
        target = utils.linkParser(link.href)
        current.pathname = target.pathname
        return current.href


    # Changes the first request to authenticate against the server receive
    # an API token. On success, the session will be opened.
    setAuthData = (options, credentials, process, sessionData={}) ->
        _.extend options,
            type: 'POST'
            contentType: 'application/json'
            data: JSON.stringify(credentials)
            success: (resp) ->
                _.extend sessionData,
                    token: resp.token
                openSession(options.url, null, process, sessionData)


    # An explicit `process` handler is used here to ensure the session is
    # setup prior to publishing to the session channels. Most downstream
    # objects depend on the URLs to be accessible.
    openSession = (url, credentials, process, sessionData={}) ->
        data = if sessionData.token? then token: sessionData.token else null
        options =
            url: url
            type: 'GET'
            data: data
            dataType: 'json'
            beforeSend: ->
                mediator.publish channels.SESSION_OPENING
            success: (resp) ->
                _.extend sessionData,
                    root: url
                    name: resp.title
                    version: resp.version
                    urls: resp._links
                process(sessionData)
                mediator.publish channels.SESSION_OPENED
            error: (xhr, status, error) ->
                channel = switch xhr.statusCode
                    when 401, 403
                        channels.SESSION_UNAUTHORIZED
                    else
                        channels.SESSION_ERROR
                mediator.publish channel, error

        # If credentials are supplied authorization is assumed to be needed
        if credentials?
            setAuthData(options, credentials, process, sessionData)

        return $.ajax(options)


    # Closes the sessions and performs any internal cleanup via the `process`
    # handler.
    closeSession = (process) ->
        process()
        mediator.publish channels.SESSION_CLOSED


    { openSession, closeSession, getSessionUrl, channels }
