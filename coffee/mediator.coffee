# Simple _mediator_ implementation. This utilizes the Pub/Sub pattern for
# decoupling the way modules 'communicate'. Currently there is no permission
# support to restrict communication to specific modules.

define ['underscore'], (_) ->

    channels = {}

    # If `once` is true, immediately unsubscribe after it's first
    # invocation.
    subscribe: (channel, _handler, once) ->
        channels[channel] ?= []
        if once
            handler = ->
                # Unsubscribe immediately, so no downstream invocations
                # occur
                c.unsubscribe channel, handler, true
                _handler.apply null, arguments
        else
            handler = _handler
        channels[channel].push handler
        return

    publish: (channel, args...) ->
        if not (handlers = channels[channel]) then return
        for handler in handlers
            # Catch any errors, allow all handlers to finish prior to
            # throwing the exception.
            if handler then handler args...
        setTimeout -> channels[channel] = _.compact handlers
        return

    unsubscribe: (channel, handler, defer) ->
        if not (handlers = channels[channel]) then return
        if (idx = handlers.indexOf handler) >= 0
            # Defer to ensure mid-iteration in publish is not broken
            if defer then handlers[idx] = null else handlers.splice(idx, 1)
        return
