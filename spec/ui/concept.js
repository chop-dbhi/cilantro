/* global define, describe, beforeEach, it, expect, waitsFor */

define(['cilantro'], function(c) {

    describe('Concept', function() {
        var collection;

        beforeEach(function() {
            collection = new c.models.ConceptCollection();
            collection.url = 'http://localhost:8000/api/concepts/';
            collection.fetch();

            waitsFor(function() {
                return collection.length > 0;
            });
        });

        describe('ConceptIndex', function() {
            var view;

            beforeEach(function() {
                view = new c.ui.ConceptIndex({
                    collection: collection
                });
            });

            it('should not define the groups on init', function() {
                expect(view.groups).toBeUndefined();
            });

            it('should group by category and order', function() {
                view.resetGroups();
                expect(view.groups).toBeDefined();
                expect(view.groups.length).toEqual(4);
                expect(view.groups.pluck('order')).toEqual([1, 2, 3, 4]);
            });

            it('should have sections per group', function() {
                view.resetGroups();
                var group = view.groups.at(0);
                expect(group.sections.length).toEqual(1);
                expect(group.sections.pluck('name')).toEqual(['Other']);
                expect(group.sections.pluck('id')).toEqual([-1]);
            });

            it('should have items per section', function() {
                view.resetGroups();
                var section = view.groups.at(0).sections.at(0);
                expect(section.items.length).toEqual(3);
            });
        });
    });
});
