# This extends cilantro and attached libraries with UI-related components
define [
    'jquery'
    'underscore'
    'backbone'
    './core'
    './ui/base'
    './ui/button'
    './ui/concept'
    './ui/field'
    './ui/charts'
    './ui/context'
    './ui/controls'
    './ui/exporter'
    './ui/tables'
    './ui/query'
    './ui/workflows'
    './ui/paginator'
    './ui/notify'
], ($, _, Backbone, c, mods...) ->

    $(document).ajaxError (event, xhr, settings, exception) ->
        # Unknown error which usually means the server is unavailable
        if not exception
            c.notify
                timeout: null
                dismissable: false
                level: 'error'
                header: 'Uh oh.'
                message: 'There is a communication problem with the server. ' +
                    '<a href="#" onclick="window.location.reload();return false">Refreshing</a> ' +
                    'the page may help.'

    # Route based on the URL
    $(document).on 'click', 'a', (event) ->
        # Only catch if a router is available
        if not c.router then return

        pathname = @pathname

        # Handle IE quirk
        if pathname.charAt(0) isnt '/'
            pathname = "/#{ pathname }"

        # Ensure the pathname does not include the root
        root = Backbone.history.root or '/'
        if pathname.slice(0, root.length) is root
            pathname = pathname.slice(root.length)

        # If this is a valid route then go ahead and navigate to it,
        # otherwise let the event process normally to load the new
        # location.
        if c.router.hasRoute(pathname)
            event.preventDefault()
            c.router.navigate(pathname, trigger: true)

        return

    # Route by ID specified by the data-route attribute.
    $(document).on 'click', '[data-route]', (event) ->
        # Only catch if a router is available
        if not c.router then return

        route = $(@).attr('data-route')

        if c.router.isNavigable(route)
            event.preventDefault()
            c.router.navigate(route, trigger: true)

    _.extend {}, mods...
