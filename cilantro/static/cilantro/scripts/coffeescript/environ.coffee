define ['jquery', 'use!underscore', 'use!backbone', 'use!bootstrap', 'use!jquery.chosen', 'backbone.charts'], ($, _, Backbone) ->

    # Ajax states
    LOADING = 'Loading'
    SYNCING = 'Syncing'
    SAVED = 'Saved'
    OFFLINE = 'Offline'
    ERROR = 'Error'

    # Gloabl attempts counter
    # TODO make this a property of the `Backbone.ajax` function
    ATTEMPTS = 0
    MAX_ATTEMPTS = 3

    # Change underscore template syntax to use curly braces, '{{ }}',
    # instead of ERB '<%= %>'
    _.templateSettings =
        evaluate: /\{\{\#\s*([^\s]+?)\s*\}\}/g
        interpolate: /\{\{\s*([^\s]+?)\s*\}\}/g
        escape: /\{\{\-\s*([^\s]+?)\s*\}\}/g

    # No global jQuery..
    # $.noConflict()

    # Reasonable timeout..
    # $.ajaxSetup
    # timeout: 5000


    # Checks for environment settings
    if (SCRIPT_NAME = @SCRIPT_NAME) is undefined
        throw Error 'Global "SCRIPT_NAME" not defined'

    if (CSRF_TOKEN = @CSRF_TOKEN) is undefined
        throw Error 'Global "CSRF_TOKEN" not defined'

    # Determines if a URL is of the same origin
    sameOrigin = (url) ->
        host = document.location.host
        protocol = document.location.protocol
        sr_origin = '//' + host
        origin = protocol + sr_origin
        (url is origin or url.slice(0, origin.length + 1) is origin + '/') or (url is sr_origin or url.slice(0, sr_origin.length + 1) is sr_origin + '/') or not (/^(\/\/|http:|https:).*/.test(url))

    # Simple check for whether a request method is safe
    safeMethod = (method) ->
        /^(GET|HEAD|OPTIONS|TRACE)$/.test method

    # Uses the globally defined `scriptName` variable to construct full URL
    # paths.
    absolutePath = (path) -> SCRIPT_NAME + path

    syncStatus = null

    # Setup the sync status text and the various global ajax
    # handlers.
    # TODO keep track of ATTEMPTS
    $ ->
        syncStatus = $('#sync-status')

        $(document)
            .ajaxSend (event, xhr, settings) ->
                # For all same origin, non-safe requests add the X-CSRFToken header
                if not safeMethod(settings.type) and sameOrigin(settings.url)
                    xhr.setRequestHeader 'X-CSRFToken', CSRF_TOKEN

                type = (settings.type or 'get').toLowerCase()
                if type is 'get'
                    syncStatus.text LOADING
                else
                    syncStatus.text SYNCING

            .ajaxStop ->
                visible = syncStatus.is(':visible')
                if ATTEMPTS is MAX_ATTEMPTS and not visible
                    syncStatus.fadeIn(200)
                else if visible
                    syncStatus.fadeOut(200)

            .ajaxError (event, xhr, settings, error) ->
                if error is 'timeout'
                    syncStatus.text OFFLINE
                else if xhr.status >= 500
                    syncStatus.text ERROR


        # Handle a few common cases if the server if there are still pending
        # requests or if the max attempts have been made.
        $(window).on 'beforeunload', ->
            if Backbone.ajax.pending
                if ATTEMPTS is MAX_ATTEMPTS
                    return "Unfortunately, your data hasn't been saved. The server
                        or your Internet connection is acting up. Sorry!"
                else
                    syncStatus.fadeIn(200)
                    return "Wow, you're quick! Your stuff is being saved.
                        It will only take a moment."

    # Override `Backbone.ajax` to queue all requests.
    # Cache Backbone ajax function, by default, just $.ajax
    _ajax = Backbone.ajax

    # Override Backbone.ajax to queue all requests to prevent
    # lost updates.
    # TODO handle errors and retries due to timeouts or errors.
    # TODO should the queue continue to be processed?
    Backbone.ajax = (options) ->
        @ajax.queue options

    Backbone.ajax.pending = false
    Backbone.ajax.requests = []

    Backbone.ajax.requestNext = ->
        if (next = @requests.shift())
            @request(next)
        else
            @pending = false

    Backbone.ajax.request = (options, trigger=true) ->
        complete = (xhr, status) =>
            if status is 'timeout'
                if ATTEMPTS < MAX_ATTEMPTS
                    ATTEMPTS++
                    return _ajax(options)
            else if 200 <= xhr.status < 300
                # In cases there was a `complete` handler defined
                if options.complete then options.complete(arguments)
                if trigger then @requestNext()

        # Add custom complete for handling retries for this particular
        # request. This ensures the queue won't be handled out of order
        options.complete = complete
        _ajax(options)
        # Each new request from the queue will reset the number of attempts
        # that have been made.
        ATTEMPTS = 1


    Backbone.ajax.queue = (options) ->
        type = (options.type or 'get').toLowerCase()
        # For GET requests, the order is not terribly important.
        # The `pending` flag is not since it does not deal with
        # saving changes to the server.
        if type is 'get'
            @request options, false
        else if @pending
            @requests.push options
        else
            @pending = true
            @request options

    { CSRF_TOKEN, SCRIPT_NAME, absolutePath }
