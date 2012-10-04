# Extends Backbone to support queuing up requests for serial request/response
# cycles rather than dealing with potential race conditions, e.g. the "lost
# update problem". The classic example of this is a user editing something
# quickly multiple times and the first set of changes saving _after_ the later
# sets of changes.
# ---
# TODO this could (and probably should) be an extension to jQuery directly
# rather than Backbone
define [
    'jquery'
    'underscore'
    'backbone'
], ($, _, Backbone) ->

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
        if (args = @requests.shift())
            [options, promise] = args
            @request options, promise
        else
            @pending = false

    Backbone.ajax.request = (_options, promise, trigger=true) ->
        options = _.extend {}, _options

        # Reference existing handlers
        success = options.success
        error = options.error
        complete = options.complete

        params =
            complete: (xhr, status) =>
                if status is 'timeout'
                    # If this does not pass, this is considered a failed request
                    if App.state.ajaxAttempts < App.ajax.maxAttempts
                        return _ajax params
                else if 200 <= xhr.status < 300
                    # In cases there was a `complete` handler defined
                    if complete then complete.apply @, arguments
                    if trigger then @requestNext()
                else
                    # Last resort, ensure this is turned off
                    @pending = false

            success: ->
                if success then success.apply @, arguments
                promise.resolveWith @, arguments

            error: (xhr, status, err) ->
                if status is 'timeout' and App.state.ajaxAttempts < App.ajax.maxAttempts
                    App.state.ajaxAttempts++
                else
                    if error then error.apply @, arguments
                    promise.rejectWith @, arguments

        params = _.extend options, params
        # Add custom complete for handling retries for this particular
        # request. This ensures the queue won't be handled out of order
        _ajax params
        # Each new request from the queue will reset the number of attempts
        # that have been made.
        App.state.ajaxAttempts = 1


    Backbone.ajax.queue = (options) ->
        type = (options.type or 'get').toLowerCase()
        # Since requests are being queued, the `xhr` is not being created
        # immediately and thus no way of adding deferred callbacks. This
        # `promise` acts as a proxy for the request's `xhr` object.
        promise = $.Deferred()

        # For GET requests, the order is not terribly important.
        # The `pending` flag is not since it does not deal with
        # saving changes to the server.
        if type is 'get'
            @request options, promise, false
        else if @pending
            @requests.push [options, promise]
        else
            @pending = true
            @request options, promise
        return promise

    return
