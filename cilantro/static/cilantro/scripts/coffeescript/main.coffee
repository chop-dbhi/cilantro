define [
    'environ'
    'jquery'

    # App router
    'router'

    # Utils
    'utils'

    # Load models/collections
    'models/charts'
    'models/datafields'
    'models/dataconcepts'
    'models/datacontexts'
    'models/dataviews'
], (environ, $) ->

    App.preferences.load()

    $ ->
        # Initialize and load the routes
        require [
            'routes/app'
            'routes/workspace'
            'routes/discover'
            'routes/composite'
            'routes/analyze'
            'routes/review'
        ], ->

            # Start up the history
            Backbone.history.start pushState: true
