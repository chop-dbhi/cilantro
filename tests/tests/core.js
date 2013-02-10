define(['cilantro'], function(c) {
    module('core');

    test('get option', 3, function() {
        c.config = {
            url: 'http://localhost:8000/api/',
            defaults: {
                view: {
                    ordering: [1]
                },
                context: {}
            }
        };
        
        equal(c.getOption('url'), 'http://localhost:8000/api/', 'simple');
        deepEqual(c.getOption('defaults.view.ordering.0'), 1, 'nested');

        // undefined
        equal(c.getOption('foo.bar.baz'), undefined, 'undefined');
    });

    test('set option', 2, function() {
        c.config = {
            url: 'http://localhost:8000/api/',
            defaults: {
                view: {
                    ordering: [1]
                },
                context: {}
            }
        };
        
        c.setOption('defaults.context.type', 'or')
        deepEqual(c.getOption('defaults.context.type'), 'or', 'nested');
        c.setOption('foo.bar.baz', 1)
        deepEqual(c.getOption('foo.bar.baz'), 1, 'undefined path');
    });

    // Requires running server...
    asyncTest('sessions', 6, function() {
        var loading = false, closed = false;

        c.subscribe(c.SESSION_OPENING, function() {
            loading = true;
        });

        c.subscribe(c.SESSION_OPENED, function() {
            equal(c.getCurrentSession(), 'http://localhost:8000/api/', 'session set');
            equal(c.getSessionUrl('concepts'), 'http://localhost:8000/api/concepts/', 'session URL');

            c.closeSession();
            equal(c.currentSession, null, 'unset session');
            ok(closed, 'session closed');

            // start test evaluation
            start();
        });

        c.subscribe(c.SESSION_CLOSED, function() {
            closed = true;
        });

        equal(c.getCurrentSession(), undefined, 'no session set');
        c.openSession('http://localhost:8000/api/');
        // in beforeSend handler..
        ok(loading, 'loading');
    });
});
