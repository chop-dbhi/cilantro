/* global define, describe, it, expect, beforeEach */

define(['cilantro'], function(c) {

    describe('Context', function() {
        var model;

        beforeEach(function() {
            model = new c.models.Context({
                json: {
                    type: 'and',
                    children: [{
                        concept: 1,
                        field: 1,
                        operator: 'in',
                        value: [1, 2]
                    }, {
                        concept: 1,
                        field: 2,
                        operator: 'lt',
                        value: 50
                    }]
                }
            });
        });

        describe('initialization', function() {

            it('should have both filter sets populated', function() {
                expect(model.filters.length).toEqual(2);
                expect(model._filters.length).toEqual(2);
            });

        });

        describe('toJSON', function() {

            it('should serialize from the public filters', function() {
                // Initialize an unapplied field
                model.define({concept: 1, field: 3});
                expect(model.toJSON().json.children.length).toEqual(2);
            });

        });

        describe('set json', function() {

            it('"soft" set should merge in the filters only', function() {
                model.set('json', {
                    type: 'and',
                    children: [{
                        concept: 1,
                        field: 1,
                        operator: 'gt',
                        value: 50
                    }]
                });

                expect(model.filters.toJSON()).toEqual([{
                    concept: 1,
                    field: 1,
                    operator: 'gt',
                    value: 50
                }]);

                expect(model._filters.toJSON()).toEqual([{
                    concept: 1,
                    field: 1,
                    operator: 'in',
                    value: [1, 2]
                }, {
                    concept: 1,
                    field: 2,
                    operator: 'lt',
                    value: 50
                }]);
            });

            it('"hard" set should merge in the internal filters', function() {
                model.set('json', {
                    type: 'and',
                    children: [{
                        concept: 1,
                        field: 1,
                        operator: 'gt',
                        value: 50
                    }]
                }, {reset: true});

                expect(model._filters.toJSON()).toEqual([{
                    concept: 1,
                    field: 1,
                    operator: 'gt',
                    value: 50
                }, {
                    concept: 1,
                    field: 2,
                    operator: 'lt',
                    value: 50
                }]);
            });
        });

        describe('define', function() {

            it('creates a new internal filter', function() {
                model.define({concept: 1, field: 3});
                expect(model._filters.length).toEqual(3);
                expect(model.filters.length).toEqual(2);
            });

            it('should be idempotent', function() {
                model.define({concept: 1, field: 2});
                expect(model._filters.length).toEqual(2);
                expect(model.filters.length).toEqual(2);
            });

        });

        describe('events', function() {

            it('should apply a filter', function() {
                var events = [],
                    filter = model.define({concept: 1, field: 3});

                filter.on('all', function(event) {events.push(event);});

                filter.apply({save: false});

                expect(model.filters.length).toEqual(3);

                expect(events).toContain('apply');
                expect(events).toContain('applied');
            });

            it('should unapply a filter', function() {
                var events = [],
                    filter = model.define({concept: 1, field: 1});

                filter.on('all', function(event) {events.push(event);});

                filter.unapply({save: false});
                expect(model.filters.length).toEqual(1);

                expect(events).toContain('unapply');
                expect(events).toContain('unapplied');
            });

            it('should apply all filters', function() {
                model.define({concept: 1, field: 3});
                model.define({concept: 1, field: 4});

                model._filters.apply({save: false});
                expect(model.filters.length).toEqual(4);
            });

            it('should unapply all filters', function() {
                model.filters.unapply({save: false});
                expect(model.filters.length).toEqual(0);
            });

        });

        describe('methods', function() {

            it('should return true if filter is applied', function() {
                var filter = model.define({concept: 1, field: 1});
                expect(model.isFilterApplied(filter)).toBe(true);

                filter = model.define({concept: 1, field: 3});
                expect(model.isFilterApplied(filter)).toBe(false);
            });

            it('should return true if filter has changed', function() {
                var filter = model.define({concept: 1, field: 1});
                expect(model.hasFilterChanged(filter)).toBe(false);

                filter.set('value', [2, 3]);
                expect(model.hasFilterChanged(filter)).toBe(true);

                // Not applied, so unknown change
                filter = model.define({concept: 1, field: 3});
                expect(model.hasFilterChanged(filter)).toBeUndefined();
            });

        });

    });

});
