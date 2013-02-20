define(['cilantro', 'cilantro/ui','text!../../mock/concepts.json'], function (c, ui, mocks) {
    describe("ConceptForm", function () {
        var concepts = JSON.parse(mocks);
        var form, model;

        beforeEach(function () {
            model = new c.models.ConceptModel(concepts[0], { parse:true });
            form = new c.ui.ConceptForm({ model:model });
        });

        it("should have a model", function () {
            expect(form.model).toEqual(model);
        });

        it("should have a fields array on its model", function(){
            expect(form.model.fields).toEqual(jasmine.any(Array));
        });



    });
});
