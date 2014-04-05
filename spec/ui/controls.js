/* global define, describe, it, expect, afterEach, waitsFor, runs */

define(['cilantro'], function(c) {

    describe('Controls', function() {

        afterEach(function() {
            // Clear custom controls
            c.controls.clear();
        });

        it('should be ready by default', function() {
            expect(c.controls.ready()).toBe(true);
        });

        it('should be populated', function() {
            expect(c.controls).toBeDefined();
            expect(c.controls.get('number')).toBeDefined();
        });

        it('should allow override', function() {
            var NumberControl = c.ui.Control.extend({});
            c.controls.set('number', NumberControl);
            expect(c.controls.get('number')).toBe(NumberControl);
        });

        it('should allow for remote controls', function() {
            c.controls.set('remote', '/spec/custom-control.js');
            expect(c.controls.ready()).toBe(false);

            waitsFor(c.controls.ready);

            runs(function() {
                expect(c.controls.get('remote')).toBeDefined();
            });
        });

    });

});
