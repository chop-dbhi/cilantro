define [
        'common/models/polling'
    ],
        
    (polling) ->

        class SessionPerspective extends polling.Model
            url: App.urls.session.perspective


        return {
            Session: SessionPerspective
        }
