define [
    'environ'
    'serrano'
], (environ, Serrano) ->

    class DataFields extends Serrano.DataFields
        url: App.urls.datafields

        initialize: ->
            super
            @on 'reset', @resolve
            @fetch()


    App.DataField = new DataFields
