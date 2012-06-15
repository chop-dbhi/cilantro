define [
    'environ'
    'jquery'
    'underscore'
    'backbone'
    'session'
], (environ, $, _, Backbone, session) ->

    # Router setup
    class Router extends Backbone.Router

        # Initialize shared components
        initialize: ->
            # Bind all route-enabled links on the page and ensure they
            # stay in sync relative to all other links
            $('body').on 'click', '[data-route]', (event) ->
                event.preventDefault()
                App.router.navigate @pathname, trigger: true


    App.router = new Router
    App.views = {}
    App.loaded = []

    ROUTING = false

    App.register = (route, name, view) ->
        if App.views[name]? then throw new Error "#{ name } view already registered"
        App.views[name] = view

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
                    App.views[_name].unload?()
                    App.views[_name].pending?()
                @loaded = []
                # Defer to end of call stack
                _.defer -> ROUTING = false

            App.views[name].load?()
            App.views[name].resolve?()
            @loaded.push name

        @router.on "route:#{ name }", ->
            links = $('[data-route]')
            # Inactivate all links
            links.parent().removeClass 'active'
            # Activate relevant links
            links.filter("[data-route=#{ name }]").parent().addClass 'active'
