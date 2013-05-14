define(['cilantro.ui', 'text!/mock/fields.json'], function (c, fieldsJSON) {
    var fields = new c.Backbone.Collection(JSON.parse(fieldsJSON));

    describe('FieldControl', function() {
        var control;

        describe('Base', function() {
            beforeEach(function() {
                control = new c.ui.FieldControl({
                    model: fields.models[0]
                });
                control.render();
            });

            it('should have an field by default', function() {
                expect(control.get()).toEqual({field: 30});
            });

            it('should never clear the field attr', function() {
                control.clear();
                expect(control.get()).toEqual({field: 30});
            });
        });

        describe('w/ Number', function() {
            beforeEach(function() {
                control = new c.ui.FieldControl({
                    model: fields.models[0]
                });
                control.render();
            });

            it('should coerce the value to a number', function() {
                control.set('value', '30');
                expect(control.get('value')).toEqual(30);
            });
        });

    });
});
