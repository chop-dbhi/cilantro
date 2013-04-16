define(['cilantro/ui', 'text!../mock/fields.json'], function (c, fieldsJSON) {

    var fields = new c.Backbone.Collection(JSON.parse(fieldsJSON));

    describe('FieldControl', function() {
        var control;

        describe('w/o Field', function() {
            beforeEach(function() {
                control = new c.ui.FieldControl;
                control.render();
            });

            it('should be empty by default', function() {
                expect(control.get()).toEqual({});
            });

            it('should set/get an object of attributes', function() {
                control.set({id: 1, operator: 'exact', value: 40});
                expect(control.get()).toEqual({id: '1', operator: 'exact', value: '40'});
            });

            it('should set/get a single attribute', function() {
                control.set('value', 50);
                expect(control.get('value')).toEqual('50');
            });

            it('should clear the attributes using `clear`', function() {
                control.set({id: 1, operator: 'exact', value: 40});
                control.clear()
                expect(control.get()).toEqual({});
            });
        });

        describe('w/ Field', function() {
            beforeEach(function() {
                control = new c.ui.FieldControl({
                    model: fields.models[0]
                });
                control.render();
            });

            it('should have an id by default', function() {
                expect(control.get()).toEqual({id: 30});
            });

            it('should never clear the id attr', function() {
                control.clear();
                expect(control.get()).toEqual({id: 30});
            });
        });

        describe('w/ Number-type Field', function() {
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
