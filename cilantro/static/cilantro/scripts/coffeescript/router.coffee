define [
    'environ'
    'jquery'
    'underscore'
    'backbone'
], (environ, $, _, Backbone) ->

    ROUTING = false

    # Keep track of routes and the currently loaded views relative to
    # a given route.
    App.routes = {}
    App.loaded = []

    App.router = new Backbone.Router

    # Light wrapper for `Router.route` method which can load and unload views
    # relative to the current route. In addition, links with '[data-route]'
    # attribute are marked as active/inactive.

    # If `route` is `false`, the view is loaded only once and does not unload
    # when other routes are triggered. This is useful for static or once-loaded
    # views applicable to the app as a whole.

    App.register = (route, name, view) ->
        if App.routes[name]? then throw new Error "#{ name } view already registered"
        App.routes[name] = view

        # Non-routable view.. loaded once
        if route is false
            view.load?()
            view.resolve?()
            return

        @router.route route, name, =>
            # First route handler, perform initial steps
            if not ROUTING
                ROUTING = true
                # Unload existing views, check for existence in case the
                # view had been destroyed in the meantime
                for _name in @loaded
                    App.routes[_name].unload?()
                    App.routes[_name].pending?()
                @loaded = []
                # Defer to end of call stack
                _.defer -> ROUTING = false

            App.routes[name].load?()
            App.routes[name].resolve?()
            @loaded.push name

        @router.on "route:#{ name }", ->
            links = $('[data-route]')
            # Inactivate all links
            links.parent().removeClass 'active'
            # Activate relevant links
            links.filter("[data-route=#{ name }]").parent().addClass 'active'
