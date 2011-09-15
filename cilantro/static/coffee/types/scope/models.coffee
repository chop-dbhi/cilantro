define [
        'common/models/polling'
    ],
        
    (polling) ->

        class SessionScope extends polling.Model
            url: App.urls.session.scope


        return {
            Session: SessionScope
        }
