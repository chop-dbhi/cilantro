define [
    'environ'
    'serrano'
], (environ, Serrano) ->

    class DataFields extends Serrano.DataFields
        url: environ.absolutePath '/api/fields/'

        initialize: ->
            @deferred = @fetch()

    App.DataField = new DataFields
