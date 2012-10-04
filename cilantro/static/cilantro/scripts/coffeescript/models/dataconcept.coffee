define [
    'environ'
    'serrano'
], (environ, Serrano) ->

    class DataConcepts extends Serrano.DataConcepts
        url: App.urls.dataconcepts

        initialize: ->
            super
            @on 'reset', @resolve
            @fetch()


    App.DataConcept = new DataConcepts
