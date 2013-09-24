define [
    'underscore'
    'backbone'
], (_, Backbone) ->

    # Base class with Backbone events
    _.extend (class Evented)::, Backbone.Events

    return Evented
