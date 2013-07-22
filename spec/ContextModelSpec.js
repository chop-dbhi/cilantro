define(['cilantro'], function (c) {

    describe('ContextModel', function() {

        it('should define a root branch', function() {
            model = new c.models.ContextModel;
            expect(model.root.nodeType).toBe('branch');
        });

        it('should add the json into the root branch', function() {
            model = new c.models.ContextModel({
                json: {
                  field: 1,
                  operator: 'in',
                  value: [1, 2, 3]
                }
            }, {parse: true});
            expect(model.root.nodeType).toBe('branch');
            expect(model.root.children.length).toBe(1);
        });

    });
});
