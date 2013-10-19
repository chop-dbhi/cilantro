define [
    'jquery'
], ($) ->

    # Relies on the jquery-ajax-queue plugin to supply this method.
    # This ensures data is not silently lost
    $(window).on 'beforeunload', ->
       if $.hasPendingRequest()
           return "Wow, you're quick! Your data is being saved. " +
                "It will only take a moment."

    # Support cross origin requests with credentials (i.e. cookies)
    # See http://www.html5rocks.com/en/tutorials/cors/
    $.ajaxPrefilter (settings, origSettings, xhr) ->
        settings.xhrFields =
            withCredentials: true
