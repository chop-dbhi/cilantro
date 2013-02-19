define(['cilantro', 'cilantro/ui','text!../../../mock/contexts.json'], function (c, ui, mocks) {
    describe("ContextModel", function () {
        var contexts = JSON.parse(mocks);
        var model;

        beforeEach(function () {
            model = new c.models.ContextModel(contexts[0], { parse:true });
        });

        it("should contain a single node under id 30", function () {
            expect(model.nodes[30].length).toEqual(1);
        });

        it("should have a single node labeled with concept id 28", function(){
           expect(model.nodes[30][0].get("concept_id")).toEqual(28);
        });

    });
});