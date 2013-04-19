define [
    '../core'
    'date'
    'inputio'
    'highcharts'
    'plugins/backbone-marionette'
    'plugins/bootstrap'
    'plugins/bootstrap-datepicker'
    'plugins/jquery-ui'
    'plugins/jquery-easing'
    'plugins/jquery-panels'
    'plugins/jquery-scroller'
    'plugins/typeahead'
    'plugins/typeselect'
], (c) ->

    c.Highcharts = Highcharts
    c.Marionette = Backbone.Marionette

    # Shortcut to Marionette template renderer
    c.renderTemplate = c.Marionette.Renderer.render

    # Extend base Marionette with mediator methods
    c.Marionette.View::publish = c.publish
    c.Marionette.View::unsubscribe = c.unsubscribe

    # Override to keep track of all handlers that are subscribed. This is
    # ensure handlers are unsubscribed before being removed
    c.Marionette.View::subscribe = (channel, handler, once) ->
        if not @_channels? then @_channels = {}
        if not once
            channels = @_channels[channel] ?= []
            channels.push(handler)
        c.subscribe(channel, handler, once)
        return

    # Unsubscribe from the mediator
    c.Marionette.View::onClose = ->
        if not @_channels? then return
        for channel, handlers of @_channels
            for handler in handlers
                @unsubscribe channel, handler
        return

    c.Marionette.View::bindSubscribers = ->
        if not @subscribers? then return
        for channel, method of @subscribers
            if not (handler = @[method])?
                throw new Error("#{ method } not a method")
            @subscribe channel, handler

    _constructor = c.Marionette.View::constructor
    c.Marionette.View::constructor = (args...) ->
        _constructor.apply(@, args)
        @bindSubscribers()

    return c
