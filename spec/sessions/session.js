/* global define, describe, beforeEach, it, expect, waitsFor, runs */

define(['jquery', 'cilantro/session'], function($, session) {

    describe('Session', function() {
        var s;

        beforeEach(function() {
            s = new session.Session({
                url: 'http://localhost:8000/api/'
            });
        });

        it('initial state', function() {
            expect(s.get('url')).toBe('http://localhost:8000/api/');
            expect(s.isValid()).toBe(true);
            expect(s.opened).toBe(false);
            expect(s.opening).toBe(false);
            expect(s.started).toBe(false);
        });

        it('open', function() {
            s.open();
            expect(s.opening).toBe(true);

            waitsFor(function() {
                return s.opened;
            }, 100);

            runs(function() {
                expect(s.opening).toBe(false);
                expect(s.opened).toBe(true);
                expect(s.response).toBeDefined();
                expect(s.error).toBeUndefined();
                expect(s.title).toBeDefined();
                expect(s.version).toBeDefined();
                expect(s.data).toBeDefined();
                for (var key in s.data) {
                    expect(s.data[key].url).toBeDefined();
                }
                expect(s.router).toBeDefined();
            });
        });

        it('start', function() {
            var that;
            s.open().done(function() {
                that = this;
            });

            waitsFor(function() {
                return s.opened;
            }, 100);

            runs(function() {
                // Ensure the context of the promise is the session itself
                expect(that).toBe(s);
                s.start({
                    pushState: false,
                    hashChange: true
                });
            });
        });

    });

});
