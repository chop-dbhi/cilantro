define(['cilantro'], function(c) {

    describe('Sessions', function() {
        var events = [];

        c.on(c.SESSION_OPENING, function() {
            events.push(c.SESSION_OPENING);
        });

        c.on(c.SESSION_OPENED, function() {
            events.push(c.SESSION_OPENED);
        });

        c.on(c.SESSION_CLOSED, function() {
            events.push(c.SESSION_CLOSED);
        });

        beforeEach(function() {
            c.session.clear();
            events = [];
            c.config.set({}, true);
        });

        it('should publish events on open and close', function() {
            expect(c.session.url()).toBeUndefined();

            runs(function() {
                c.session.open('/mock/root.json');
                expect(c.session.sessions['/mock/root.json']).toBeDefined();
            });

            waitsFor(function() {
                return c.session.current.loaded();
            }, 'The session is loaded', 200);

            runs(function() {
                expect(c.session.url()).toBe('/mock/root.json');
                c.session.close();
                expect(c.session.current).toBeUndefined();
                expect(events).toEqual([c.SESSION_OPENING, c.SESSION_OPENED, c.SESSION_CLOSED]);
            });
        });
    });

});
