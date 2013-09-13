define [
    'jquery'
], ($) ->

    # Relies on the jquery-ajax-queue plugin to supply this method.
    # This ensures data is not silently lost
    $(window).on 'beforeunload', ->
       if $.hasPendingRequest()
           return "Wow, you're quick! Your data is being saved. " +
                "It will only take a moment."
