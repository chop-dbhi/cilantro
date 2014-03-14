/* global define, describe, beforeEach, waitsFor, it, expect, runs */

define(['cilantro'], function(c) {

    describe('Context', function() {

        beforeEach(function() {
            c.sessions.open(c.config.get('url'));

            waitsFor(function() { return c.data; });
        });

        it('should always define a default session', function() {
            var model = c.data.contexts.getSession();
            model.save(null, {wait: true});

            expect(model).toBeDefined();
            expect(model.manager).toBeDefined();

            // Wait to run the remaining tests until this is saved
            waitsFor(function() {
                return model.id;
            });
        });

        it('should support creating', function() {
            var done;

            var model = c.data.contexts.create({}, {
                success: function() {
                    done = true;
                }
            });

            waitsFor(function() { return done; });

            runs(function() {
                expect(model.id).toBeDefined();
                // Clean up
                model.destroy({wait: true});
            });
        });

        it('should support updating', function() {
            var done, model = c.data.contexts.getSession();

            model.save({name: 'Special', session: false}, {
                wait: true,
                success: function() { done = true; }
            });

            waitsFor(function() { return done; });

            runs(function() {
                expect(model.get('name')).toEqual('Special');
                // Clean up
                model.destroy({wait: true});
            });
        });

    });

});
