define(['cilantro', 'text!../../mock/contexts.json'], function (c, mocks) {

    describe('ContextNodeModel (base class)', function() {
        it('should validate as condition', function() {
            var model = new c.models.ContextNodeModel({
                field: 3,
                operator: 'exact',
                value: 30
            });
            expect(model.isValid()).toBe(true);
        });

        it('should validate as branch', function() {
            var model = new c.models.ContextNodeModel({
                type: 'and',
                children: []
            });

            expect(model.isValid()).toBe(true);
        });

        it('should validate as composite', function() {
            var model = new c.models.ContextNodeModel({
                composite: 40
            });
            expect(model.isValid()).toBe(true);
        });
    });

    describe('ConditionNodeModel', function() {
        var model;

        beforeEach(function() {
            model = new c.models.ConditionNodeModel({
                field: 3,
                operator: 'exact',
                value: 30
            });
        });

        it('should validate', function() {
            expect(model.isValid()).toBe(true);
        });
    });

    describe('BranchNodeModel', function() {
        var model, node;

        beforeEach(function() {
            model = new c.models.BranchNodeModel({
                type: 'and',
                children: []
            });

            node = new c.models.ConditionNodeModel({
                field: 1,
                concept: 1,
                value: 30,
                operator: 'exact'
            });
        });

        it('should validate', function() {
            expect(model.isValid()).toBe(true);
        });

        it('should deep validate', function() {
            model.add(node);
            expect(model.isValid({deep: true})).toBe(true);
        });

        it('should add', function() {
            model.add(node);
            expect(model.get('children').length).toBe(1);

            // Adding again is a no-op
            model.add(node);
            expect(model.get('children').length).toBe(1);
        });

        it('should remove', function() {
            model.add(node);

            model.remove(node);
            expect(model.get('children').length).toBe(0);

            // Removing again is a no-op
            model.remove(node);
        });

        it('should clear', function() {
            model.add(node);
            model.clear();
            expect(model.get('children').length).toBe(0);
        });

        it('should not deep validate', function() {
            model.attributes.children.push({
                bad: 1
            });
            expect(model.isValid({deep: true})).toBe(false);
        });

        it('should not add itself', function() {
            expect(function() {
                model.add(model);
            }).toThrow();
        });

        it('should not add bare attributes', function() {
            expect(function() {
                model.add(model.attributes);
            }).toThrow();
        });
    });

    describe('CompositeNodeModel', function() {
        var model;

        beforeEach(function() {
            model = new c.models.CompositeNodeModel({
                composite: 40
            });
        });

        it('should validate', function() {
            expect(model.isValid()).toBe(true);
        });
    });

    describe('ContextModel', function () {

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
            });
            expect(model.root.nodeType).toBe('branch');
            expect(model.root.get('children').length).toBe(1);
        });

    });
});
