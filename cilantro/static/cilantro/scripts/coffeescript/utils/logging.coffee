define [
    'backbone'
    'underscore'
], (Backbone, _) ->

    LOG_LEVELS =
        'debug': 0
        'info': 1
        'warning': 2
        'error': 3
        'critical': 4


    class Message extends Backbone.Model
        defaults:
            level: 'info'
            timeout: 3000


    class Log extends Backbone.Collection
        model: Message

        initialize: ->
            App.hub.subscribe 'log', @log

        log: (message) =>
            if message instanceof Backbone.Model
                @add message
                console.log message


    class MessageView extends Backbone.View
        template: _.template '<div class="message <%= level %>"><%= message %></div>'

        render: ->
            @el = @$(@template @model.get('message'))
            @

        show: ->
            @el.fadeIn 500

        hide: ->
            @el.fadeOut 300


    class LogView extends Backbone.View
        el: '#messages'

        initialize: ->
            App.hub.subscribe 'log', @log
            App.hub.subscribe 'dismiss', @dismiss

            @modelViews = {}

        log: (view) =>
            # TODO add logic for handling higher priority messages..
            if not (view instanceof Backbone.View)
                model = view
                view = new MessageView
                    model: model

                @modelViews[model] = view

            @el.append view.el.hide()
            view.show()

            # if the timeout falsy, the message is expected to be explicitly
            # dismissed.
            if view.timeout
                @_messageTimer = _.delay ->
                    view.hide()
                , view.timeout

        dismiss: (view) =>
            if not (view instanceof Backbone.View)
                model = view
                view = @modelViews[model]
                delete @modelViews[model]
            if view
                clearTimeout @_messageTimer
                view.hide()


    return {
        Message: Message
        MessageView: MessageView
        Log: Log
        LogView: LogView
    }
