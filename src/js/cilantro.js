/* global define */

define([
    './cilantro/core',
    './cilantro/session',
    './cilantro/models',
    './cilantro/ui',
    './cilantro/setup'
], function(c, session, models, ui) {

    c.sessions = new session.SessionManager();

    // Attach containers of models and ui (views) components
    c.models = models;
    c.ui = ui;

    // Keep the current session and router reference up-to-date
    c.sessions.on(session.SESSION_OPENED, function(session) {
        c.session = session;
        c.router = session.router;
        c.data = session.data;
    });

    var ready = false;

    // Takes a handler to call once Cilantro has declared itself "ready".
    // Once cilantro is ready, subsequent handlers will be executed
    // immediately.
    c.ready = function(handler) {
        if (ready) {
            handler();
            return;
        }

        var intervalId, timeoutId;

        // Re-evalute ready status every 15 ms
        intervalId = setInterval(function() {
            // TODO use a async registry that loops through and checks
            // that all are ready
            ready = c.templates.ready() && c.controls.ready();

            if (ready) {
                clearTimeout(timeoutId);
                clearTimeout(intervalId);
                handler();
            }
        }, 15);

        // Add a timeout in case there is a bug or something cause the components
        // never to be ready.
        timeoutId = setTimeout(function() {
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
    return c;

});
