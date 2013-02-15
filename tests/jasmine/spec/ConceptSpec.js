define(['cilantro', 'cilantro/ui','text!../../../mock/concepts.json'], function (c, ui, mocks) {
    describe("ConceptForm", function () {
        var concepts = JSON.parse(mocks);
//        beforeEach(function () {
//            form = c.ui.views.ConceptForm({model:c.data.concepts.get(1)});
//        });

        it("should have a mock", function () {
            expect(concepts).toEqual(jasmine.any(Array));
        });
    });
});
