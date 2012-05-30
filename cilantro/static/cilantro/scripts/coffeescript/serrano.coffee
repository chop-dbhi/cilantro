define [
    'underscore'
    'backbone'
], (_, Backbone) ->

    class DataField extends Backbone.Model

    class DataFields extends Backbone.Collection
        model: DataField


    class DataConcept extends Backbone.Model

    class DataConcepts extends Backbone.Collection
        model: DataConcept


    class DataContext extends Backbone.Model

    class DataContexts extends Backbone.Collection
        model: DataContext


    { DataFields, DataConcepts, DataContexts }
