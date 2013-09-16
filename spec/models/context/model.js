define(['cilantro'], function (c) {

    describe('ContextModel', function() {
        var model;

        it('should define a manager', function() {
            model = new c.models.ContextModel;
            expect(model.manager).toBeDefined();
        });
    });

});
