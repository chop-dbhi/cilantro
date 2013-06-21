# This extends cilantro and attached libraries with UI-related components
define [
    './cilantro'
    './cilantro/router'
    './cilantro/ui/base'
    './cilantro/ui/button'
    './cilantro/ui/concept'
    './cilantro/ui/field'
    './cilantro/ui/charts'
    './cilantro/ui/context'
    './cilantro/ui/controls'
    './cilantro/ui/exporter'
    './cilantro/ui/tables'
    './cilantro/ui/workflows'
], (c, router, mods...) ->

    c.ui = c._.extend {}, mods...

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
                Backbone.history.navigate(pathname, trigger: true)

            return

    return c
