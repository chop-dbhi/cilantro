define ['use!underscore', 'use!backbone'], (_, Backbone) ->

    class Distribution extends Backbone.Model


    class Distributions extends Backbone.Collection
        model: Distribution
 

    class DataField extends Backbone.Model

    class DataFields extends Backbone.Collection


    class DataConcepts extends Backbone.Collection


    class DataContext extends Backbone.Model

    class DataContexts extends Backbone.Collection


    { DataFields, DataConcepts, Distributions }
