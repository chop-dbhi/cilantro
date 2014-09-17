/* global define */

define([
    'underscore',
    'backbone',
    'marionette',
    'jquery',
    'loglevel',
    './core',
    './ui'
], function(_, Backbone, Marionette, $, loglevel, c, ui) {

    // Set configuration options for corresponding APIs
    c.templates.set(c.config.get('templates', {}));
    c.controls.set(c.config.get('controls', {}));

    // Extend Marionette template loader facilities to use Cilantro template API
    var defaultLoadTemplate = Marionette.TemplateCache.prototype.loadTemplate,
        defaultCompileTemplate = Marionette.TemplateCache.prototype.compileTemplate;

    // Override to get in the template cache
    Marionette.TemplateCache.prototype.loadTemplate = function(templateId) {
        var func = c.templates.get(templateId);
        if (!func) func = defaultLoadTemplate.call(this, templateId);
        return func;
    };

    // Prevent re-compiling already compiled templates
    Marionette.TemplateCache.prototype.compileTemplate = function(template) {
        if (typeof template !== 'function') {
            template = defaultCompileTemplate(template);
        }
        return template;
    };

    // See http://documentcloud.github.io/underscore-contrib/#exists
    _.exists = function(value) {
        return !_.isUndefined(value) && !_.isNull(value);
    };

    // Initialize notification stream and append it to the body
    var stream = new ui.Notifications({
        id: 'cilantro-notifications'
    });

    $('body').append(stream.render().el);

    // Add public method
    c.notify = stream.notify;

    // Support cross origin requests with credentials (i.e. cookies)
    // See http://www.html5rocks.com/en/tutorials/cors/
    $.ajaxPrefilter(function(settings) {
        settings.xhrFields = {
            withCredentials: true
        };
    });

    // Setup debugging facilities
    if (c.config.get('debug')) {
        loglevel.setLevel('debug');

        c.on('all', function() {
            loglevel.info.apply(loglevel.info, [].slice.call(arguments, 0));
        });
    }

    // Relies on the jquery-ajax-queue plugin to supply this method.
    // This ensures data is not silently lost
    $(window).on('beforeunload', function() {
        if (c.config.get('debug') || !$.hasPendingRequest()) {
            // Turn off ajax error handling to prevent unwanted notifications displaying
            $(document).off('ajaxError');
            return;
        }

        return "Wow, you're quick! Your data is being saved. " +
               "It will only take a moment.";
    });

    $(document).ajaxError(function(event, xhr, settings, exception) {
        // A statusText value of 'abort' is an aborted request which is
        // usually intentional by the app or from a page reload.
        if (xhr.statusText === 'abort' ||
            (xhr.status >= 300 && xhr.status < 400) ) return;

        var message = '';

        if (xhr.status === 0 && exception === '') {
            // An empty exception value is an unknown error which usually
            // means the server is unavailable.
            message = 'The application is no longer responding.';
        } else {
            // General purpose error message
            message = 'There is a communication problem with the server. ' +
                '<a href="#" onclick="location.reload()">Refreshing</a> ' +
                'the page may help.';
        }

        c.notify({
            timeout: null,
            dismissable: true,
            level: 'error',
            header: 'Uh oh.',
            message: message
        });
    });

    // Route based on the URL
    $(document).on('click', 'a', function(event) {
        // Only catch if a router is available
        if (!c.router) return;

        // Path of the target link
        var path = this.pathname;

        // Handle IE quirk
        if (path.charAt(0) !== '/') path = '/' + path;

        // Trim off the root on the path if present
        var root = Backbone.history.root || '/';

        if (path.slice(0, root.length) === root) {
            path = path.slice(root.length);
        }

        // If this is a valid route then go ahead and navigate to it,
        // otherwise let the event process normally to load the new
        // location.
        if (c.router.hasRoute(path)) {
            event.preventDefault();
            c.router.navigate(path, {trigger: true});
        }
    });

    // Route by ID specified by the data-route attribute.
    $(document).on('click', '[data-route]', function(event) {
        // Only catch if a router is available
        if (!c.router) return;

        var route = $(event.target).attr('data-route');

        if (c.router.isNavigable(route)) {
            event.preventDefault();
            c.router.navigate(route, {trigger: true});
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

    // Handlers for the window blur/focus events to support tracking. The
    // primary use of these events is to toggle pinging the server when the
    // window goes out of focus.
    window.onblur = function() {
        c.trigger('blur');
    };

    window.onfocus = function() {
        c.trigger('focus');
    };
});
