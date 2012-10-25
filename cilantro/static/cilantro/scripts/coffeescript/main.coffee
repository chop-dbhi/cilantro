define [
    'environ'
    'jquery'
    'underscore'
    'backbone'

    # App router
    'router'
    'session'

    # Load models/collections
    'models/datafield'
    'models/dataconcept'
], (environ, $, _, Backbone, Router) ->

    routes = App.routes

    # Pluck out just the module names
    modules = _.pluck routes, 'module'

    # Initialize and load the routes.
    require modules, (klasses...) ->

        # The root is the mountpoint of the application with which all other
        # routes are relative too. If this is not explicitly defined and
        # cannot be inferred by the routes, the current path will be used.
        root = App.root

        # In case no URL matches, it will be redirected to the 'head', i.e.
        # the first route defined. This will simply be the first route
        # defined.
        head = App.head

        path = window.location.pathname
        pathlen = path.length

        for config, i in routes
            if not config.module then continue
            if not head? and config.route isnt false then head = config.route
            Router.register config.route, config.name, new klasses[i] config.options

            # Attempt to infer the root based on the routes if it has not
            # already been defined
            if config.route and not root?
                routelen = config.route.length
                if path.substr(pathlen - routelen) is config.route
                    root = path.substr(0, pathlen - routelen)

        # If the root has not been defined or inferred, use the current path
        root ?= path
        head ?= ''

        # Load preferences after everything is loaded to ensure all the
        # subscribers are... subscribed.
        App.preferences.load()

        require [
            'models/datacontext'
            'models/dataview'
        ]

        # Setup various DOM events
        $ ->

            # Start up the history now that all the main routes are registered
            # If this does not match any route, replace the current URL with
            # the 'head' URL
            if not Backbone.history.start(root: root, pushState: true)
                Router.navigate(head, replace: true, trigger: true)

            nav = $('<ul class="nav pull-left" />')

            # Populate the main navigation if a fragment is associated with
            # the route
            for config in routes
                if not config.module or config.route is false then continue
                li = $ "<li><a href=\"#{ root }#{ config.route }\"
                    data-route=\"#{ config.route }\">#{ config.label }</a></li>"
                nav.append li

            nav.appendTo 'header .container-fluid'

            # Bind all route-enabled links on the page and ensure they
            # stay in sync relative to all other links
            $('body').on 'click', '[data-route]', (event) ->
                event.preventDefault()
                route = $(@).data('route')
                Router.navigate route, trigger: true
