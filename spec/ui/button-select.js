/* global define, describe, expect, it */

define(['cilantro'], function(c) {

    describe('Button Select', function() {

        it('should fire on select', function() {

            var view = new c.ui.ButtonSelect({
                collection: [1, 2, 3, 4]
            });
            view.render();

            var selection, triggered = false;
            view.$el.on('change', function(event, value) {
                triggered = true;
                selection = value;
            });

            view.setSelection(4);
            expect(selection).toBe(4);
            expect(triggered).toBe(true);
            expect(view.collection.where({selected: true}).length).toEqual(1);
        });

    });

});
