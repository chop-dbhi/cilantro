/* global define, describe, it, expect */

define(['cilantro'], function(c) {

    describe('Controls', function() {

        it('should be populated', function() {
            expect(c.controls).toBeDefined();
            expect(c.controls.get('number')).toBeDefined();
        });

        it('should allow override', function() {
            var NumberControl = c.ui.Control.extend({});
            c.controls.set('number', NumberControl);
            expect(c.controls.get('number')).toBe(NumberControl);
        });

    });

});
