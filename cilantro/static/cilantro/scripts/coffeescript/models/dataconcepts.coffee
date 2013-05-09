define [
    'environ'
    'serrano'
], (environ, Serrano) ->

    class DataConcepts extends Serrano.DataConcepts
        url: environ.absolutePath '/api/concepts/'

        initialize: ->
            @deferred = @fetch()

    App.DataConcept = new DataConcepts
