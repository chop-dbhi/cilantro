/* global define, describe, beforeEach, it, expect, waitsFor */

define(['cilantro', 'cilantro/session'], function(c, session) {

    describe('Session', function() {
        var s, url = c.config.get('url');

        beforeEach(function() {
            s = new session.Session({
                url: url
            });
        });

        it('init', function() {
            expect(s.get('url')).toBe(url);
            expect(s.isValid()).toBe(true);
            expect(s.opened).toBe(false);
            expect(s.opening).toBe(false);
            expect(s.started).toBe(false);
        });

        describe('Cycle', function() {
            beforeEach(function() {
                s.open();

                waitsFor(function() {
                    return s.opened;
                });
            });

            it('open', function() {
                expect(s.opening).toBe(false);
                expect(s.opened).toBe(true);
                expect(s.error).toBeUndefined();
                expect(s.title).toBeDefined();
                expect(s.version).toBeDefined();
                expect(s.data).toBeDefined();
                expect(s.router).toBeDefined();

                for (var key in s.data) {
                    expect(s.data[key].url).toBeDefined();
                }
            });

            it('start', function() {
                s.start({
                    pushState: false,
                    hashChange: true
                });
                expect(s.started).toBe(true);
            });

            it('end', function() {
                s.start({
                    pushState: false,
                    hashChange: true
                });
                s.end();
                expect(s.started).toBe(false);
                expect(s.router._routes).toEqual({});
            });

            it('close', function() {
                var data = s.data;
                s.close();

                expect(s.data).toBeUndefined();
                expect(s.opened).toBe(false);

                for (var key in s.data) {
                    expect(data[key].length).toEqual(0);
                    expect(data[key].url).toBeUndefined();
                }
            });

        });

    });

});
