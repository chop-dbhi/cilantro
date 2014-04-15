/* global define */

define([
    'underscore',
    './cilantro/core',
    './cilantro/session',
    './cilantro/models',
    './cilantro/ui',
    './cilantro/setup'
], function(_, c, session, models, ui) {

    _.extend(c, session.events);

    c.sessions = new session.SessionManager();

    // Attach containers of models and ui (views) components
    c.models = models;
    c.ui = ui;

    // Keep the current session and router reference up-to-date
    c.sessions.on(c.SESSION_OPENED, function(session) {
        c.session = session;
        c.router = session.router;
        c.data = session.data;
    });

    c.sessions.on(c.SESSION_CLOSED, function() {
        delete c.session;
        delete c.router;
        delete c.data;
    });

    var ready = false;

    // Takes a handler to call once Cilantro has declared itself "ready".
    // Once cilantro is ready, subsequent handlers will be executed
    // immediately.
    c.ready = function(handler) {
        if (ready) {
            if (handler) handler();
            return;
        }

        // Re-evalute ready status every 15 ms
        var intervalId = setInterval(function() {
            // TODO use a async registry that loops through and checks
            // that all are ready
            ready = c.templates.ready() && c.controls.ready();

            if (ready) {
                clearTimeout(timeoutId);
                clearTimeout(intervalId);
                c.trigger('ready', c);
                if (handler) handler();
            }
        }, 15);

        // Add a timeout in case there is a bug or something cause the components
        // never to be ready.
        var timeoutId = setTimeout(function() {
            clearTimeout(intervalId);

            c.notify({
                timeout: null,
                dismissable: false,
                level: 'error',
                header: 'Too long getting ready.',
                message: 'Sorry about that, a few of the components needed ' +
                         'to display the page took too longer to load. A ' +
                         '<a href="#" onclick="location.reload()">refresh</a> ' +
                         'sometimes resolves the issue.'
            });
        }, 500);
    };

    this.cilantro = c;

    // Bind early events on Cilantro namespace
    _.each(c.config.get('events'), function(value, key) {
        c.on(key, value);
    });

    c.trigger('init', c);

    return c;

});
