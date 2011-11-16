define [
    'jquery'
    'backbone'
    'underscore'
    'pubsub'
    'common/utils'
    'vendor/jquery.ui'
], ($, Backbone, _, PubSub, Utils) ->

    # Attach to the window since they are used all over the
    # application
    @$ = $
    @Backbone = Backbone
    @_ = _

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
