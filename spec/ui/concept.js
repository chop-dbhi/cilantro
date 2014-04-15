/* global define, describe, beforeEach, afterEach, it, expect, waitsFor */

define(['cilantro'], function(c) {

    describe('Concepts', function() {
        beforeEach(function() {
            c.sessions.open(c.config.get('url'));

            waitsFor(function() {
                return c.data && c.data.concepts.length > 0;
            });
        });

        afterEach(function() {
            c.sessions.close();
        });

        describe('ConceptIndex', function() {
            var view;

            beforeEach(function() {
                view = new c.ui.ConceptIndex({
                    collection: c.data.concepts
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
