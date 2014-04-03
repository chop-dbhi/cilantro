/* global define, describe, it, expect, beforeEach, waitsFor, runs */

define(['underscore', 'cilantro'], function(_, c) {

    var testCases = [
        {
            count: 1,
            attrs: {
                field: 1,
                concept: 1,
                operator: 'in',
                value: [1, 2]
            }
        },

        {
            count: 1,
            attrs: {
                field: 1,
                operator: 'in',
                value: [1, 2]
            }
        },

        {
            count: 1,
            attrs:{
                field: 1,
                concept: 1,
                type: 'and',
                children: [{
                    field: 1,
                    operator: 'in',
                    value: [1, 2]
                }, {
                    field: 1,
                    operator: 'any',
                    value: [3, 4]
                }]
            }
        },

        {
            count: 2,
            attrs: {
                concept: 1,
                type: 'and',
                children: [{
                    field: 1,
                    operator: 'in',
                    value: [1, 2]
                }, {
                    field: 2,
                    operator: 'lt',
                    value: 50
                }]
            }
        }
    ];


    var runTest = function(testCase) {
        it('should have ' + testCase.count + ' filter(s)', function() {
            var filters = new c.models.Filters(testCase.attrs, {parse: true});

            expect(filters.length).toEqual(testCase.count);

            expect(_.uniq(filters.pluck('id')).length).toEqual(testCase.count);
        });
    };

    describe('Filters', function() {

        describe('parse', function() {
            for (var i = 0; i < testCases.length; i++) {
                runTest(testCases[i]);
            }
        });

        var filters;

        beforeEach(function() {
            filters = new c.models.Filters();
        });

        describe('events', function() {
            it('should be syncless', function() {
                var triggered = 0, done = false;

                filters.on({
                    request: function() { triggered++; },
                    sync: function() { triggered++; }
                });

                filters.create({field: 1, concept: 1});

                setTimeout(function() {
                    done = true;
                }, 500);

                waitsFor(function() {
                    return done;
                });

                runs(function() {
                    expect(triggered).toEqual(0);
                });
            });

            it('should trigger apply on apply', function() {
                var triggered = false;

                filters.on('apply', function(coll) {
                    expect(coll).toBe(filters);
                    triggered = true;
                });

                filters.apply();
                expect(triggered).toBe(true);
            });

            it('should trigger unapply on unapply', function() {
                var triggered = false;

                filters.on('unapply', function(coll) {
                    expect(coll).toBe(filters);
                    triggered = true;
                });

                filters.unapply();
                expect(triggered).toBe(true);
            });
        });

        describe('Filter', function() {
            var filter;

            beforeEach(function() {
                filter = new c.models.Filter();
            });

            describe('events', function() {
                it('should be syncless', function() {
                    var triggered = 0, done = false;

                    filter.on({
                        request: function() { triggered++; },
                        sync: function() { triggered++; }
                    });

                    filter.save();

                    setTimeout(function() {
                        done = true;
                    }, 500);

                    waitsFor(function() {
                        return done;
                    });

                    runs(function() {
                        expect(triggered).toEqual(0);
                    });
                });

                it('should trigger apply on apply', function() {
                    var triggered = false;

                    filter.on('apply', function(model) {
                        expect(model).toBe(filter);
                        triggered = true;
                    });

                    filter.apply();
                    expect(triggered).toBe(true);
                });

                it('should trigger unapply on unapply', function() {
                    var triggered = false;

                    filter.on('unapply', function(model) {
                        expect(model).toBe(filter);
                        triggered = true;
                    });

                    filter.unapply();
                    expect(triggered).toBe(true);
                });
            });

            describe('methods', function() {
                it('should toggle enabled state', function() {
                    expect(filter.isEnabled()).toBe(true);
                    filter.toggleEnabled();
                    expect(filter.isEnabled()).toBe(false);
                    filter.toggleEnabled();
                    expect(filter.isEnabled()).toBe(true);
                });
            });
        });

    });
});
