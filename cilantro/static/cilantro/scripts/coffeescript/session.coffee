define [
    'environ'
    'mediator'
    'underscore'
    'backbone'
], (environ, mediator, _, Backbone) ->

    class Preferences extends Backbone.Model
        url: environ.absolutePath '/api/preferences/'

        defaults:
            session: {}

        initialize: ->
           # Subscribe to modules saving off session data
            mediator.subscribe 'session/save', (key, data) =>
                session = @get 'session'
                session[key] = data
                @save session: session
            return

        load: ->
            # Publish session data
            for key, data of @attributes.session
                mediator.publish 'session/load/'+key, data
            return
 

    App.preferences = new Preferences App.preferences
