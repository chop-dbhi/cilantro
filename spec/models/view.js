/* global define, describe, afterEach, beforeEach, waitsFor, it, expect, runs */

define(['cilantro'], function(c) {

    describe('Views', function() {

        beforeEach(function() {
            c.sessions.open(c.config.get('url'));

            waitsFor(function() { return c.data; });
        });

        afterEach(function() {
            c.sessions.close();
        });

        it('should always define a default session', function() {
            expect(c.data.views.session).toBeDefined();
            expect(c.data.views.session.get('session')).toBe(true);
        });

        it('should support creating', function() {
            var toggle;

            var model = c.data.views.create({}, {
                success: function() {
                    toggle = true;
                }
            });

            waitsFor(function() { return toggle; });

            runs(function() {
                expect(model.id).toBeDefined();
            });
        });

        it('should support updating', function() {
            var toggle, model;

            waitsFor(function() {
                return c.data.views.length > 1;
            });

            runs(function() {
                model = c.data.views.at(1);

                model.save({name: 'Special'}, {
                    success: function() {
                        toggle = true;
                    }
                });
            });

            waitsFor(function() {
                return toggle;
            });

            runs(function() {
                expect(model.get('name')).toEqual('Special');
            });
        });

        it('should support deleting', function() {
            var toggle, model;

            waitsFor(function() {
                return c.data.views.length > 1;
            });

            runs(function() {
                model = c.data.views.findWhere({session: false});

                model.destroy({
                    success: function() {
                        toggle = true;
                    }
                });
            });

            waitsFor(function() {
                return toggle;
            });

        });

        describe('Facets', function() {
            var model;

            beforeEach(function() {
                model = new c.data.views.model({
                    json: {
                        columns: [1, 2, 3],
                        ordering: [[2, 'desc'], [1, 'asc']]
                    }
                });
            });

            it('should define the facets collection', function() {
                expect(model.facets).toBeDefined();
            });

            it('should parse the json and populated the facets collection', function() {
                expect(model.facets.length).toEqual(3);
                expect(model.facets.toJSON()).toEqual([
                    {
                        concept: 1,
                        sort: 'asc',
                        sort_index: 1  // jshint ignore:line
                    }, {
                        concept: 2,
                        sort: 'desc',
                        sort_index: 0  // jshint ignore:line
                    }, {
                        concept: 3,
                    }
                ]);
            });

            it('should update the facets collection on change', function() {
                var newJson = {
                    columns: [3, 1, 2],
                    ordering: [[1, 'desc'], [3, 'asc']]
                };

                model.set('json', newJson);

                expect(model.facets.toJSON()).toEqual([
                    {
                        concept: 3,
                        sort: 'asc',
                        sort_index: 1  // jshint ignore:line
                    }, {
                        concept: 1,
                        sort: 'desc',
                        sort_index: 0  // jshint ignore:line
                    }, {
                        concept: 2,
                    }
                ]);
            });

            describe('facetsToJSON', function() {
                it('should serialize as the original json', function() {
                    var json = model.get('json');
                    expect(model.facetsToJSON()).toEqual(json);
                });
            });

        });
    });

});
