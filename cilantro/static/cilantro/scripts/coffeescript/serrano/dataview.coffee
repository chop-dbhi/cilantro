define [
    'backbone'
], (Backbone) ->

    class DataView extends Backbone.Model
        url: ->
            if @isNew() then super else @get 'url'


    class DataViews extends Backbone.Collection
        model: DataView

        getSession: ->
            (@filter (model) -> model.get 'session')[0]


    { DataView, DataViews }
