define [
        'common/models/polling'
    ],
        
    (polling) ->

        class SessionScope extends polling.Model
            url: App.endpoints.session.scope

            initialize: ->
                super

                App.hub.subscribe 'report/revert', @revert

            # Currently, the session perspective is managed via the session
            # report thus this needs to only fetch itself to update
            revert: => @fetch()


        return {
            Session: SessionScope
        }
