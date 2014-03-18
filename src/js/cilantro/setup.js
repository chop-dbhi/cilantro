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


    // Page visibility API: http://stackoverflow.com/a/1060034/407954
    var hidden = 'hidden';

    var visibilityMap = {
        focus: true,
        focusin: true,
        pageshow: true,
        blur: false,
        focusout: false,
        pagehide: false
    };

    function onchange (event) {
        event = event || window.event;

        var isVisible;

        // Map visibility
        if (event.type in visibilityMap) {
            isVisible = visibilityMap[event.type];
        } else {
            isVisible = !this[hidden];
        }

        // Trigger 'visible' and 'hidden' events on cilantro
        if (isVisible === true) {
            c.trigger('visible');
        } else if (isVisible === false) {
            c.trigger('hidden');
        }
    }

    // Standards
    if (hidden in document) {
        document.addEventListener('visibilitychange', onchange);
    } else if ((hidden = 'mozHidden') in document) {
        document.addEventListener('mozvisibilitychange', onchange);
    } else if ((hidden = 'webkitHidden') in document) {
        document.addEventListener('webkitvisibilitychange', onchange);
    } else if ((hidden = 'msHidden') in document) {
        document.addEventListener('msvisibilitychange', onchange);
    // IE 9 and lower
    } else if ('onfocusin' in document) {
        document.onfocusin = document.onfocusout = onchange;
    // All others
    } else {
        window.onpageshow = window.onpagehide =
            window.onfocus = window.onblur = onchange;
    }

});
