# This extends cilantro and attached libraries with UI-related components
define [
    './core'
    './router'
    './ui/base'
    './ui/button'
    './ui/concept'
    './ui/field'
    './ui/charts'
    './ui/context'
    './ui/controls'
    './ui/exporter'
    './ui/tables'
    './ui/workflows'
], (c, router, mods...) ->

    # TODO clean this up
    ui = c.getOption('ui') or {}
    c.router = new router.Router
        el: ui.main
        maxHeight: ui.maxHeight

    # Register pre-define routes
    if (routes = c.getOption('routes'))?
        c.router.register(routes)

    # Catch and process all click events to anchors to see if any routes
    # match the path. If a route matches, prevent the default behavior
    if c.getOption('autoroute')

        # Route based on the URL
        $(document).on 'click', 'a', (event) ->
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
            route = c.$(@).attr('data-route')

            if c.router.isNavigable(route)
                event.preventDefault()
                c.router.navigate(route, trigger: true)


    c._.extend {}, mods...
