/* global define, describe, beforeEach, it, expect */

define(['cilantro'], function(c) {

    describe('Config', function() {

        beforeEach(function() {
            c.config.set({
                url: 'http://localhost:8000/api/',
                defaults: {
                    view: {
                        ordering: [1]
                    },
                    context: {}
                }
            });
        }, true);

        describe('Get option', function() {

            it('should return the base url', function() {
                expect(c.config.get('url')).toBe('http://localhost:8000/api/');
            });

            it('should get a nested option', function() {
                expect(c.config.get('defaults.view.ordering.0')).toBe(1);
            });

            it('should return undefined for missing options', function() {
                expect(c.config.get('foo.bar.baz')).toBeUndefined();
            });

        });

        describe('Set option', function() {
            it('should set an existing (nested) option', function() {
                c.config.set('defaults.context.type', 'or');
                expect(c.config.get('defaults.context.type')).toBe('or');
            });

            it('should set a non-existing option', function() {
                c.config.set('foo.bar.baz', 1);
                expect(c.config.get('foo.bar.baz')).toBe(1);
            });

        });

    });
});
