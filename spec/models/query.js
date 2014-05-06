/* global define, describe, afterEach, beforeEach, waitsFor, it, expect, runs */

define(['cilantro'], function(c) {

    describe('Queries', function() {

        beforeEach(function() {
            c.sessions.open(c.config.get('url'));

            waitsFor(function() { return c.data; });
        });

        afterEach(function() {
            c.sessions.close();
        });

        it('should be empty to start', function() {
            expect(c.data.queries.length).toEqual(0);
        });

        it('should support creating', function() {
            var toggle;

            var model = c.data.queries.create({}, {
                success: function() {
                    toggle = true;
                }
            });

            waitsFor(function() { return toggle; });

            runs(function() {
                expect(model.id).toBeDefined();
            });
        });

        it('should support updating', function() {
            var toggle, model;

            waitsFor(function() {
                return c.data.queries.length > 0;
            });

            runs(function() {
                model = c.data.queries.at(0);

                model.save({'name': 'Special'}, {
                    success: function() { toggle = true; }
                });
            });

            waitsFor(function() { return toggle; });

            runs(function() {
                expect(model.get('name')).toEqual('Special');
            });
        });

        it('should support deleting', function() {
            var toggle, model;

            waitsFor(function() {
                return c.data.queries.length > 0;
            });

            runs(function() {
                model = c.data.queries.at(0);

                model.destroy({
                    success: function() { toggle = true; }
                });
            });

            waitsFor(function() { return toggle; });

        });

        /* TODO add tests for sharing.. */

    });

});
