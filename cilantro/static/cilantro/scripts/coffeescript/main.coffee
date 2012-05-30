define [
    'environ'
    'jquery'
    'use!underscore'
    'use!backbone'
    'views'
    'serrano'
    'use!jquery.ui'
    'router'
    'models/charts'
], (environ, $, _, Backbone, views, Serrano) ->

    class DataFields extends Serrano.DataFields
        url: environ.absolutePath '/api/fields/'

        initialize: ->
            @deferred = @fetch()

    class DataConcepts extends Serrano.DataConcepts
        url: environ.absolutePath '/api/concepts/'

        initialize: ->
            @deferred = @fetch()

    # Note, these instances are not plural since the `models` property is
    # actually the list of models..
    App.DataField = new DataFields
    App.DataConcept = new DataConcepts

    $ ->

        # Lazily create the QueryViews
        App.DataConcept.deferred.done ->
            App.DataConcept.each (model, i) ->
                if model.get 'queryview'
                    new views.QueryView
                        model: model

        App.filters = new views.DataFiltersAccordian
            el: '#data-filters-accordian'
            collection: App.DataConcept


        # Load the preferences now that the routes are loaded
        App.preferences.load()

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
