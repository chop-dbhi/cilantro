define ['jquery', 'backbone', 'underscore', 'pubsub', 'common/utils'], ($, Backbone, _, PubSub, utils) ->
    # Attach to the window since they are used all over the
    # application
    window.$ = $
    window.Backbone = Backbone
    window._ = _
    
    # an object may already be defined, so we create a reference
    # to the existing attributes
    attrs = window.App or {}

    # initialize a pub/sub hub
    attrs.hub = new PubSub

    attrs.Models = {}
    attrs.Collections = {}
    attrs.Views = {}

    # finally, initialize the App object for the page
    window.App = App = new utils.App attrs