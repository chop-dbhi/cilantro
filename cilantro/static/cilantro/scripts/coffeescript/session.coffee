define [
    'environ'
    'mediator'
    'channels'
    'underscore'
    'backbone'
], (environ, mediator, channels, _, Backbone) ->


    # User preferences and session-related classes
    class Session extends Backbone.Model
        url: App.urls.preferences

        defaults:
            json: {}

        initialize: ->
            super

            # Any object can publish data to the session by publishing to
            # the channel and providing the property key and data to save.
            # The subscription will ensure this data is saved off immediately.
            mediator.subscribe channels.SESSION_SET, (key, data) =>
                json = @get 'json'

                if not (session = json.session)
                    session = json.session = {}
                session[key] = data

                @save()

            # Once synced with the server, notify over the channel
            @on 'sync', ->
                mediator.publish channels.SESSION_SYNCED

            @on 'change', -> @load()

            @fetch()

        load: ->
            # For each property on the session object, the contents
            # are published.
            json = @get 'json'

            for key, data of (json.session or {})
                # Create the channel based on the key
                channel = _.template channels.SESSION_LOAD, key: key
                mediator.publish channel, data

            return
 

    session = new Session

    return
