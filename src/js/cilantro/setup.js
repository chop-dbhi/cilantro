/* global define */

define([
    'jquery',
    './core',
    './logger'
], function($, c, logger) {

    // Support cross origin requests with credentials (i.e. cookies)
    // See http://www.html5rocks.com/en/tutorials/cors/
    $.ajaxPrefilter(function(settings) {
        settings.xhrFields = {
            withCredentials: true
        };
    });

    // Setup debugging facilities
    if (c.config.get('debug')) {
        logger.setLevel('debug');

        c.on('all', function() {
            logger.info.apply(logger.info, [].slice.call(arguments, 0));
        });
    }

    // Relies on the jquery-ajax-queue plugin to supply this method.
    // This ensures data is not silently lost
    $(window).on('beforeunload', function() {
        if (!c.config.get('debug') && $.hasPendingRequest()) {
            return "Wow, you're quick! Your data is being saved. " +
                   "It will only take a moment.";
        }
    });

});
