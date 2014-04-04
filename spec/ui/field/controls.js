/* global define, describe, beforeEach, afterEach, it, expect, runs, waitsFor */

define(['backbone', 'cilantro'], function(Backbone, c) {

    describe('FieldControls', function() {
        var fields, controls, options, filter, field;

        beforeEach(function() {
            fields = new c.models.FieldCollection();
            fields.url = 'http://localhost:8000/api/fields/';

            runs(function() {
                fields.fetch();
            });

            waitsFor(function() {
                return fields.length > 0;
            });

            runs(function() {
                filter = new Backbone.Model();
                field = fields.findWhere({field_name: 'hgb'});

                options = new Backbone.Collection([{
                    control: 'number',
                    filter: filter,
                    model: field
                },
                {
                    control: 'search',
                    filter: filter,
                    model: field
                }]);

                controls = new c.ui.FieldControls({
                    collection: options
                });

                controls.render();
            });
        });

        afterEach(function() {
            controls.close();
        });

        it('should render the controls', function() {
            expect(controls.$el.children().length).toEqual(2);
        });

        it('each should contain the *real* control', function() {
            controls.children.each(function(proxy) {
                expect(proxy.view).toBeDefined();
                expect(proxy.$el.children()[0]).toBe(proxy.view.el);
            });
        });

        it('control proxy should close *real* control', function() {
            var proxy = controls.children.findByIndex(0);
            var control = proxy.view;
            proxy.close();
            expect(control.isClosed).toBe(true);
            expect(control._events).toEqual({});
        });
    });
});
