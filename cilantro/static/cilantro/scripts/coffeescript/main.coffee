define [
    'environ'
    'jquery'

    # App router
    'router'

    # Load models/collections
    'models/charts'
    'models/datafields'
    'models/dataconcepts'
    'models/datacontexts'

    # Load shared views
    'views/queryviews'
], (environ, $) ->

    App.preferences.load()

    $ ->
        # Initialize and load the routes
        require [
            'routes/workspace'
            'routes/discover'
            'routes/composite'
            'routes/analyze'
            'routes/review'
        ], ->

            # Start up the history
            Backbone.history.start pushState: true
