define(['cilantro'], function(c) {

    describe('View Model', function() {
        var model, json;

        beforeEach(function() {
            json = {
                columns: [1, 2, 3],
                ordering: [[2, 'desc'], [1, 'asc']]
            };
            model = new c.models.ViewModel({
                json: json
            });
        });

        describe('Facets collection', function() {
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
        });

        describe('facetsToJSON', function() {
            it('should serialize as the original json', function() {
                expect(model.facetsToJSON()).toEqual(json);
            });
        });

    });
});
