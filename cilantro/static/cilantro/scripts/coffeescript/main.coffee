define [
    'environ'
    'jquery'

    # App router
    'router'
    'session'

    # Load models/collections
    'models/datafield'
    'models/dataconcept'
], (environ, $) ->

    routes = App.routes

    # Pluck out just the module names
    modules = _.pluck routes, 'module'

    # Initialize and load the routes.
    require modules, (klasses...) ->

        root = environ.SCRIPT_NAME or '/'
        if root.substr(root.length - 1) isnt '/'
            root = root + '/'

        for config, i in routes
            if not config.module then continue
            fragment = if config.url then config.url.substr(root.length) else false
            App.register fragment, config.name, new klasses[i] config.options

        # Start up the history now that all the main routes are registered
        Backbone.history.start
            root: root
            pushState: true

        # Load preferences after everything is loaded to ensure all the
        # subscribers are... subscribed.
        App.preferences.load()

        require [
            'models/datacontext'
            'models/dataview'
        ]

        # Setup various DOM events
        $ ->

            nav = $('<ul class="nav pull-left" />')

            # Populate the main navigation if a fragment is associated with
            # the route
            for route in routes
                if not route.url then continue
                li = $ "<li><a href=\"#{ route.url }\" data-route=\"#{ route.name }\">#{ route.label }</a></li>"
                nav.append li

            nav.appendTo 'header .container-fluid'

            # Bind all route-enabled links on the page and ensure they
            # stay in sync relative to all other links
            $('body').on 'click', '[data-route]', (event) ->
                event.preventDefault()
                frag = $(@).data('route')
                if frag.substr(frag.length-1) isnt '/'
                    frag = frag + '/'
                App.router.navigate frag, trigger: true
