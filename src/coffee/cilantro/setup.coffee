define [
    'jquery'
    './core'
    './logger'
], ($, c, logger) ->

    # Support cross origin requests with credentials (i.e. cookies)
    # See http://www.html5rocks.com/en/tutorials/cors/
    $.ajaxPrefilter (settings, origSettings, xhr) ->
        settings.xhrFields =
            withCredentials: true

    # Setup debugging facilities
    if c.config.get('debug')
        logger.setLevel('debug')

        c.on 'all', (event, args...) ->
            logger.info(event, args...)
    else
        # Relies on the jquery-ajax-queue plugin to supply this method.
        # This ensures data is not silently lost
        $(window).on 'beforeunload', ->
           if $.hasPendingRequest()
               return "Wow, you're quick! Your data is being saved. " +
                    "It will only take a moment."
