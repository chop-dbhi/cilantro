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

    return (@cilantro = c)
