/* global define, describe, it, expect, waitsFor, runs, beforeEach, afterEach */

define(['cilantro'], function(c) {

    describe('Session Manager', function() {
        var triggered, url = c.config.get('url');

        beforeEach(function() {
            triggered = [];

            c.listenTo(c.sessions, 'all', function(event) {
                if (/^session:/.test(event)) {
                    triggered.push(event);
                }
            });
        });

        afterEach(function() {
            c.stopListening(c.sessions);
            c.sessions.close();
        });

        it('open', function() {
            c.sessions.open(url);

            waitsFor(function() {
                return !c.sessions.pending;
            });

            runs(function() {
                expect(c.sessions.length).toEqual(1);
                expect(c.sessions.active.opened).toBe(true);
                expect(triggered).toEqual([
                    c.SESSION_OPENING,
                    c.SESSION_OPENED
                ]);

            });

            runs(function() {
                // Opening it again does trigger the session since it is
                // already open
                triggered = [];
                c.sessions.open(url);
            });

            waitsFor(function() {
                return !c.sessions.pending;
            });

            runs(function() {
                expect(c.sessions.length).toEqual(1);
                expect(triggered).toEqual([]);
            });
        });

        it('close', function() {
            c.sessions.open(url);

            waitsFor(function() {
                return !c.sessions.pending;
            });

            runs(function() {
                c.sessions.close();
                expect(triggered).toEqual([
                    c.SESSION_OPENING,
                    c.SESSION_OPENED,
                    c.SESSION_CLOSED
                ]);
                expect(c.sessions.active).toBeUndefined();
            });
        });

        it('fail', function() {
            c.sessions.open('http://localhost:8000/api2/');

            waitsFor(function() {
                return !c.sessions.pending;
            });

            runs(function() {
                expect(triggered).toEqual([
                    c.SESSION_OPENING,
                    c.SESSION_ERROR
                ]);
            });
        });

    });

});
