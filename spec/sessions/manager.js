define(['cilantro/session'], function(session) {
    var events = session.events;

    describe('Session Manager', function() {
        var manager, triggered;

        beforeEach(function() {
            manager = new session.SessionManager;
            triggered = [];

            manager.on(events.SESSION_OPENING, function() {
                triggered.push(events.SESSION_OPENING);
            });

            manager.on(events.SESSION_OPENED, function() {
                triggered.push(events.SESSION_OPENED);
            });

            manager.on(events.SESSION_CLOSED, function() {
                triggered.push(events.SESSION_CLOSED);
            });

        });

        it('open', function() {
            var url = '/mock/root.json';
            manager.open(url)
                .done(function() {
                    expect(manager.length).toEqual(1);
                    expect(manager.active.get('url')).toBeDefined();
                    expect(triggered).toEqual([events.SESSION_OPENING, events.SESSION_OPENED]);
                });
        });
    });

});
