define [
    'backbone'
], (Backbone) ->

    class SessionPerspective extends Backbone.Model
        url: App.endpoints.session.perspective

        initialize: ->
            super

            App.hub.subscribe 'report/revert', @revert

        # Currently, the session perspective is managed via the session
        # report thus this needs to only fetch itself to update
        revert: => @fetch()


    return Session: SessionPerspective
