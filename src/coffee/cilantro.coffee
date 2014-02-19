###
Exported module for Cilantro.
###

define [
    './cilantro/core'
    './cilantro/session'
    './cilantro/models'
    './cilantro/ui'
    './cilantro/setup'
], (c, session, models, ui) ->

    c.sessions = new session.SessionManager
    c.models = models
    c.ui = ui

    # Keep the current session and router reference up-to-date
    c.sessions.on session.SESSION_OPENED, (session) ->
        c.session = session
        c.router = session.router
        c.data = session.data

    # Takes a handler to call once Cilantro has declared itself "ready".
    c.ready = (handler) ->
        id = setInterval ->
            if c.templates.ready() and c.controls.ready()
                clearTimeout(id)
                handler()
        , 15

    return (@cilantro = c)
