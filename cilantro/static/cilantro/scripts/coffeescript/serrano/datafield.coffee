define [
    'backbone'
], (Backbone) ->

    class DataField extends Backbone.Model

    class DataFields extends Backbone.Collection
        model: DataField


    { DataField, DataFields }
