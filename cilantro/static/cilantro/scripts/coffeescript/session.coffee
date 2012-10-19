define [
    'environ'
    'mediator'
    'underscore'
    'backbone'
], (environ, mediator, _, Backbone) ->

    # User preferences and session-related classes

    class Preferences extends Backbone.Model
        url: App.urls.preferences

        defaults:
            json: {}

        initialize: ->
            # Initialize deferred components
            super

            # Any object can publish data to the session by publishing to
            # the channel and providing the property key and data to save.
            # The subscription will ensure this data is saved off immediately.
            mediator.subscribe 'session/changed', @when (key, data) =>
                json = @get 'json'
                if not (session = json.session)
                    session = json.session = {}
                session[key] = data
                @save()

            # Once synced with the server, notify over the channel
            @on 'sync', ->
                mediator.publish 'session/synced'

            return

        load: ->
            # For each property on the session object, the contents
            # are published.
            json = @get 'json'
            for key, data of (json.session or {})
                mediator.publish "session/load/#{ key }", data
            return
 

    # Fetch the preferences
    App.preferences = new Preferences
    App.preferences.fetch()
