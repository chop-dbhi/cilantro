/* global define, describe, it, expect, waitsFor, runs, beforeEach */

define(['cilantro/session'], function(session) {

    var url = 'http://localhost:8000/api/';

    describe('SessionManager', function() {
        var manager, triggered;

        beforeEach(function() {
            manager = new session.SessionManager();
            triggered = [];

            manager.on('all', function(event) {
                if (/^session:/.test(event)) {
                    triggered.push(event);
                }
            });
        });

        it('open', function() {
            manager.open(url);

            waitsFor(function() {
                return !manager.pending;
            });

            runs(function() {
                expect(manager.length).toEqual(1);
                expect(manager.active.opened).toBe(true);
                expect(triggered).toEqual([
                    session.SESSION_OPENING,
                    session.SESSION_OPENED
                ]);

            });

            runs(function() {
                // Opening it again does trigger the session since it is
                // already open
                triggered = [];
                manager.open(url);
            });

            waitsFor(function() {
                return !manager.pending;
            });

            runs(function() {
                expect(manager.length).toEqual(1);
                expect(triggered).toEqual([]);
            });
        });

        it('close', function() {
            manager.open(url);

            waitsFor(function() {
                return !manager.pending;
            });

            runs(function() {
                manager.close();
                expect(triggered).toEqual([
                    session.SESSION_OPENING,
                    session.SESSION_OPENED,
                    session.SESSION_CLOSED
                ]);
                expect(manager.active).toBeUndefined();
            });
        });

        it('fail', function() {
            manager.open('http://localhost:8000/api2/');

            waitsFor(function() {
                return !manager.pending;
            });

            runs(function() {
                expect(triggered).toEqual([
                    session.SESSION_OPENING,
                    session.SESSION_ERROR
                ]);
            });
        });
    });

});
