define [
    'environ'
    'serrano'
], (environ, Serrano) ->

    class DataFields extends Serrano.DataFields
        url: App.urls.datafields


    App.DataField = new DataFields
