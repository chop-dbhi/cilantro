define [
    '../../core'
    'tpl!templates/views/session-switcher.html'
], (c, templates...) ->

    templates = c._.object ['switcher'], templates

    class SessionSwitcher extends c.Marionette.ItemView
        template: templates.switcher

        ui:
            unauthorized: '.server-unauthorized'
            error: '.server-error'
            session: '[name=sessions]'
            sessionUrl: '[name=session-url]'
            username: '[name=username]'
            password: '[name=password]'

        events:
            'submit': 'toggleSwitch'

        initialize: ->
            c.on channels.SESSION_UNAUTHORIZED, @showUnauthorized
            c.on channels.SESSION_ERROR, @showError

        switch: (url) ->
            c.closeSession()
            c.openSession(url)

        toggleSwitch: (event) ->


        showUnauthorized: (error) =>
            @ui.unauthorized.show()

        showError: (error) =>
            @ui.error.show()


    { SessionSwitcher }
