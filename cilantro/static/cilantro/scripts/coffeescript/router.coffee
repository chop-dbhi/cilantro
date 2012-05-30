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

            # Initialize modals
            $('.modal').modal show: false


    App.router = new Router

    App.views = {}
    App.loaded = []

    App.register = (route, name, view) ->
        if App.views[name]? then throw new Error "#{ name } view already registered"
        App.views[name] = view

        @router.route route, name, =>
            # First route handler, perform initial steps
            if not App._routing
                App._routing = true
                # Unload existing views, check for existence in case the
                # view had been destroyed in the meantime
                (App.views[_name]?.unload?() for _name in @loaded)
                @loaded = []
                # Defer to end of call stack
                _.defer -> App._routing = false

            App.views[name]?.load?()
            @loaded.push name

        @router.on "route:#{ name }", ->
            links = $('[data-route]')
            # Inactivate all links
            links.parent().removeClass 'active'
            # Activate relevant links
            links.filter("[data-route=#{ name }]").parent().addClass 'active'
