define(['cilantro'], function(c) {

    describe('Sessions', function() {
        var events = [];

        c.subscribe(c.SESSION_OPENING, function() {
            events.push(c.SESSION_OPENING);
        });

        c.subscribe(c.SESSION_OPENED, function() {
            events.push(c.SESSION_OPENED);
        });

        c.subscribe(c.SESSION_CLOSED, function() {
            events.push(c.SESSION_CLOSED);
        });

        beforeEach(function() {
            events = [];
            c.config = {};
        });

        it('should publish events on open', function() {
            expect(c.getCurrentSession()).toBeUndefined();

            runs(function() {
                c.openSession('/mock/root.json');
            });

            waitsFor(function() {
                return !!c.getCurrentSession();
            }, 'The server responded', 200);

            runs(function() {
                expect(events).toEqual([c.SESSION_OPENING, c.SESSION_OPENED]);
                expect(c.getCurrentSession()).toBe('/mock/root.json');
            });
        });

        it('should publish events on close', function() {
            c.closeSession();
            expect(c.getCurrentSession()).toBeUndefined();
            expect(events).toEqual([c.SESSION_CLOSED]);
        });
    });

});
