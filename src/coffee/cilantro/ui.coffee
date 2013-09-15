# This extends cilantro and attached libraries with UI-related components
define [
    'jquery'
    'underscore'
    'backbone'
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
    './ui/paginator'
], ($, _, Backbone, c, router, mods...) ->


    # Define the primary router with the main element and app root
    c.router = new router.Router
        el: c.config.get('ui.main')
        root: c.config.get('root')


    # Register pre-define routes
    if (routes = c.config.get('routes'))?
        if typeof routes is 'function'
            routes = routes()
        c.router.register(routes)


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
        route = $(@).attr('data-route')

        if c.router.isNavigable(route)
            event.preventDefault()
            c.router.navigate(route, trigger: true)


    _.extend {}, mods...
