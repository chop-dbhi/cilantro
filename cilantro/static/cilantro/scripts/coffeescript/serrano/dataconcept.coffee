define [
    'backbone'
], (Backbone) ->

    class DataConcept extends Backbone.Model

    class DataConcepts extends Backbone.Collection
        model: DataConcept


    { DataConcept, DataConcepts }
