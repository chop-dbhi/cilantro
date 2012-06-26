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
