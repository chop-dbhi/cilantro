/* global define, describe, beforeEach, waitsFor, it, expect, runs */

define(['cilantro'], function(c) {

    describe('Query', function() {

        beforeEach(function() {
            c.sessions.open(c.config.get('url'));

            waitsFor(function() { return c.data; });
        });

        it('should be empty to start', function() {
            expect(c.data.queries.length).toEqual(0);
        });

        it('should support creating', function() {
            var done;

            var model = c.data.queries.create({}, {
                success: function() {
                    done = true;
                }
            });

            waitsFor(function() { return done; });

            runs(function() {
                expect(model.id).toBeDefined();
            });
        });

        it('should support updating', function() {
            var done, model = c.data.queries.at(0);

            model.save({'name': 'Special'}, {
                wait: true,
                success: function() { done = true; }
            });

            waitsFor(function() { return done; });

            runs(function() {
                expect(model.get('name')).toEqual('Special');
            });
        });

        /* TODO add tests for sharing.. */

    });

});
