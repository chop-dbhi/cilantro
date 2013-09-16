define [
    'underscore'
    './cilantro/core'
    './cilantro/session'
    './cilantro/models'
    './cilantro/structs'
    './cilantro/ui'
], (_, c, session, models, structs, ui) ->

    c.session = new session.SessionManager
    _.extend c, session.channels

    c.models = models
    c.structs = structs
    c.ui = ui

    return (@cilantro = c)
