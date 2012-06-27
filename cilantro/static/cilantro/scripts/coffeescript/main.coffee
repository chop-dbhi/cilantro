define [
    'environ'
    'jquery'

    # App router
    'router'
    'session'

    # Load models/collections
    'models/charts'
    'models/datafields'
    'models/dataconcepts'
    'models/datacontexts'
    'models/dataviews'
], (environ, $) ->

    # Initialize and load the routes.
    require [
        'routes/app'
        'routes/workspace'
        'routes/discover'
        'routes/composite'
        'routes/analyze'
        'routes/review'
    ], (AppArea, WorkspaceArea, DiscoverArea, CompositeArea, AnalysisArea, ReviewArea) ->

        # Register top-level routes
        App.register false, 'app', new AppArea
        App.register '', 'workspace', new WorkspaceArea
        App.register 'discover/', 'discover', new DiscoverArea
        App.register 'discover/composite/', 'composite', new CompositeArea
        App.register 'analyze/', 'analyze', new AnalysisArea
        App.register 'review/', 'review', new ReviewArea

        # Start up the history now that all the main routes are registered
        Backbone.history.start
            pushState: true
            root: environ.SCRIPT_NAME or '/'

        # Load preferences after everything is loaded to ensure all the
        # subscribers are... subscribed.
        App.preferences.load()

        # Setup various DOM events
        $ ->

            # Bootstrap pre-rendered DOM elements
            $('.panel').panel()

            $('[data-toggle*=panel]').each ->
                (toggle = $(this)).on 'click', ->
                    # If this data-toggle specifies a target, use that, otherwise assume
                    # it is a .panel-toggle within the panel itself.
                    if toggle.data 'target'
                        panel = $ toggle.data('target')
                    else
                        panel = toggle.parent()
                    panel.panel 'toggle'

            # Bind all route-enabled links on the page and ensure they
            # stay in sync relative to all other links
            $('body').on 'click', '[data-route]', (event) ->
                event.preventDefault()
                App.router.navigate @pathname, trigger: true

