define [
    'jquery'
    'underscore'
    'backbone'
    'pubsub'
    'common/utils'
], ($, _, Backbone, PubSub, Utils) ->

    # Attach to the window since they are used all over the
    # application
    @$ = @jQuery = $

    # an object may already be defined, so we create a reference
    # to the existing attributes
    attrs = @App or {}

    # initialize a pub/sub hub
    attrs.hub = new PubSub

    attrs.Models = {}
    attrs.Collections = {}
    attrs.Views = {}

    # finally, initialize the App object for the page
    @App = App = new Utils.App attrs
