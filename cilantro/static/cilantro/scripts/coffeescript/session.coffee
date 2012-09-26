define [
    'environ'
    'mediator'
    'underscore'
    'backbone'
], (environ, mediator, _, Backbone) ->

    # User preferences and session-related classes

    class Preferences extends Backbone.Model
        url: environ.absolutePath '/api/preferences/'

        defaults:
            session: {}

        initialize: ->
            # Initialize deferred components
            super

            # Any object can publish data to the session by publishing to
            # the channel and providing the property key and data to save.
            # The subscription will ensure this data is saved off immediately.
            mediator.subscribe 'session/changed', @when (key, data) =>
                session = @get 'session'
                session[key] = data
                @save session: session

            # Once synced with the server, notify over the channel
            @on 'sync', ->
                mediator.publish 'session/synced'

            return

        load: ->
            # For each property on the session object, the contents
            # are published.
            for key, data of @attributes.session
                mediator.publish "session/load/#{ key }", data
            return
 

    # This looks strange, but the preferences prior to the this call is
    # simply an object. This is being passed in as the data to initialize
    # the Preferences model.
    App.preferences = new Preferences
    App.preferences.fetch()
