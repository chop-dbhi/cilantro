###
The cilantro/ui/notify module provides an interface for creating notifications
for display to users.
###
define [
    'underscore'
    'backbone'
    'marionette'
    'tpl!templates/notification.html'
], (_, Backbone, Marionette, templates...) ->

    templates = _.object ['notification'], templates

    class NotificationModel extends Backbone.Model
        defaults:
            level: 'info'
            timeout: 4000
            dismissable: true
            header: null
            message: ''

    class Notification extends Marionette.ItemView
        className: 'alert'

        template: templates.notification

        ui:
            dismiss: '[data-dismiss]'
            header: 'h4'
            message: 'div'

        events:
            'click [data-dismiss]': 'dismiss'
            'mouseover': 'hold'
            'mouseout': 'release'

        dismiss: ->
            # Clear the timer if set
            clearTimeout(@_timer)

        hold: ->
            if not @_start then return
            clearTimeout(@_timer)
            # In case the fade out has started
            @$el.clearQueue('fx').show()

        release: ->
            if not @_start then return
            # Determine the time left relative to the start time
            end = @_start + @model.get('timeout')
            # Release after one second in case the mouse runs away
            timeout = Math.max(end - (new Date()).getTime(), 1000)
            @_timer = setTimeout =>
                @$el.fadeOut()
            , timeout

        onRender: ->
            # Info is the default so the empty string and null will
            # use the info class. Warning does not require a class
            # (this uses Bootstrap's alert classes).
            levelClass = switch (level = @model.get('level'))
                when '', null then 'alert-info'
                when 'warning' then ''
                else "alert-#{ level }"

            # Add class for the level. Supported levels include 'info',
            # 'success', 'error' and 'warning'
            @$el.addClass(levelClass)

            # Toggle header if falsy
            @ui.header.hide(!!@model.get('header'))

            # Toggle dismiss button
            @ui.dismiss.toggle(@model.get('dismissable'))

            # Add a timeout
            if (timeout = @model.get('timeout'))
                @_start = (new Date()).getTime()
                @release()

    class Notifications extends Marionette.CollectionView
        className: 'notifications'

        itemView: Notification

        constructor: (options={}) ->
            options.collection ?= new Backbone.Collection
            super(options)

        notify: (attrs) =>
            # Handle shorthand notation with only a message
            if typeof attrs is 'string'
                attrs = message: attrs
            model = new NotificationModel(attrs)
            @collection.add(model)
            @children.findByModel(model)

    { Notifications, Notification }
