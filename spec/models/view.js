/* global define, describe, beforeEach, waitsFor, it, expect, runs */

define(['cilantro'], function(c) {

    describe('View', function() {

        beforeEach(function() {
            c.sessions.open(c.config.get('url'));

            waitsFor(function() { return c.data; });
        });

        it('should always define a default session', function() {
            var model = c.data.views.getSession();
            model.save(null, {wait: true});

            expect(model).toBeDefined();

            // Wait to run the remaining tests until this is saved
            waitsFor(function() {
                return model.id;
            });
        });

        it('should support creating', function() {
            var done;

            var model = c.data.views.create({}, {
                wait: true,
                success: function() {
                    done = true;
                }
            });

            waitsFor(function() { return done; });

            runs(function() {
                expect(model.id).toBeDefined();
                model.destroy({wait: true});
            });
        });

        it('should support updating', function() {
            var done, model = c.data.views.getSession();

            model.save({name: 'Special', session: false}, {
                wait: true,
                success: function() {
                    done = true;
                }
            });

            waitsFor(function() {
                return done;
            });

            runs(function() {
                expect(model.get('name')).toEqual('Special');
                model.destroy({wait: true});
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
                        sort_index: 1
                    }, {
                        concept: 2,
                        sort: 'desc',
                        sort_index: 0
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
                        sort_index: 1
                    }, {
                        concept: 1,
                        sort: 'desc',
                        sort_index: 0
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
