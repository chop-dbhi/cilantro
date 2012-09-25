define [
    'environ'
    'serrano'
], (environ, Serrano) ->

    class DataConcepts extends Serrano.DataConcepts
        url: environ.absolutePath '/api/concepts/'

        initialize: ->
            super
            @on 'reset', @resolve
            @fetch()

    App.DataConcept = new DataConcepts
