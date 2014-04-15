/* global define, describe, afterEach, it, expect */

define(['cilantro'], function(c) {

    // Note, the config class uses utilty functions to do the getting/setting
    describe('Config', function() {
        var previous = c.config.options;

        // Ensure these are reset to prevent any downstream side-effects
        afterEach(function() {
            c.config.options = previous;
        });

        it('should reset', function() {
            c.config.set('foo.bar.baz', 40);
            expect(c.config.get('foo.bar.baz')).toEqual(40);

            c.config.reset();
            expect(c.config.get('foo')).toBeUndefined();
        });

        it('should unset', function() {
            c.config.set('foo.bar.baz', 40);
            c.config.unset('foo.bar.baz', 40);
            expect(c.config.get('foo.bar.baz')).toBeUndefined();
        });

    });
});
