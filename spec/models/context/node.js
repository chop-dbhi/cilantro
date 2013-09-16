define(['cilantro'], function (c) {

    describe('ContextNodeModel (base class)', function() {

        it('should validate as condition', function() {
            var model = new c.models.ContextNodeModel({
                field: 1,
                operator: 'exact',
                value: 30
            });

            expect(model.isValid()).toBe(true);
            expect(model.toJSON()).toEqual({
                field: 1,
                operator: 'exact',
                value: 30
            });
        });

        it('should validate as branch', function() {
            var model = new c.models.ContextNodeModel({
                type: 'and',
                children: []
            });

            expect(model.isValid()).toBe(true);
            expect(model.toJSON()).toEqual({
                type: 'and',
                children: []
            });
            expect(model.toJSON({strict: true})).toEqual({
                type: 'and',
                children: []
            });
        });

        it('should validate as composite', function() {
            var model = new c.models.ContextNodeModel({
                composite: 1
            });

            expect(model.isValid()).toBe(true);
            expect(model.toJSON()).toEqual({
                composite: 1
            });
        });

        it('should find itself', function() {
            var model = new c.models.ContextNodeModel({
                field: 1,
                operator: 'exact',
                value: 30
            });

            expect(model.find({field: 1})).toBe(model);
        });
    });

    describe('ConditionNodeModel', function() {
        var model;

        beforeEach(function() {
            model = new c.models.ConditionNodeModel({
                field: 1,
                operator: 'exact',
                value: 30
            });
        });

        it('should validate', function() {
            expect(model.isValid()).toBe(true);
        });

        it('should not validate', function() {
            model.unset('value');
            expect(model.isValid()).toBe(false);
        });
    });

    describe('BranchNodeModel', function() {
        var model, node;

        beforeEach(function() {
            model = new c.models.BranchNodeModel({
                type: 'and',
                children: [{
                    field: 1,
                    concept: 1,
                    value: 30,
                    operator: 'exact'
                }, {
                    concept: 2,
                    type: 'and',
                    children: [{
                        field: 2,
                        concept: 2,
                        value: [0.5, 1],
                        operator: 'range'
                    }]
                }]
            });

            node = new c.models.ConditionNodeModel({
                field: 3,
                concept: 3,
                value: 30,
                operator: 'exact'
            });
        });

        it('should have a children collection', function() {
            expect(model.children).toBeDefined();
            expect(model.children.length).toBe(2);
        });

        it('should convert descendants into nodes', function() {
            var c0 = model.children.at(0);
            var c1 = model.children.at(1);
            var g0 = c1.children.at(0);
            expect(c0 instanceof c.models.ConditionNodeModel).toBe(true);
            expect(c1 instanceof c.models.BranchNodeModel).toBe(true);
            expect(g0 instanceof c.models.ConditionNodeModel).toBe(true);
        });

        it('should validate', function() {
            expect(model.isValid()).toBe(true);
        });

        it('should merge', function() {
            var attrs = {
                type: 'and',
                children: [{
                    field: 1,
                    concept: 1,
                    value: 50,
                    operator: 'gt'
                }, {
                    concept: 2,
                    type: 'or',
                    children: [{
                        field: 2,
                        concept: 2,
                        value: [1, 3],
                        operator: '-range'
                    }]
                }]
            };

            // Ensure a real merge occurs rather than recreating the nodes
            var cidsBefore = model.children.map(function(model) {
                return model.cid;
            });
            model.set(attrs);

            var cidsAfter = model.children.map(function(model) {
                return model.cid;
            });
            expect(model.toJSON()).toEqual(attrs);
            expect(cidsBefore).toEqual(cidsAfter);
        });

        it('should find child node (by field)', function() {
            model.children.add(node);
            expect(model.find({field: 3})).toBe(node);
        });

        it('should find child node (by concept)', function() {
            model.children.add(node);
            expect(model.find({concept: 3})).toBe(node);
        });

        it('should find child node (by field and concept)', function() {
            model.children.add(node);
            expect(model.find({field: 3, concept: 3})).toBe(node);
        });

        describe('children collection', function() {
            it('should add', function() {
                model.children.add(node);
                expect(model.children.length).toBe(3);

                // Adding again is a no-op
                model.children.add(node);
                expect(model.children.length).toBe(3);
            });

            it('should remove', function() {
                model.children.add(node);

                model.children.remove(node);
                expect(model.children.length).toBe(2);

                // Removing again is a no-op
                model.children.remove(node);
                expect(model.children.length).toBe(2);
            });

            it('should not add itself', function() {
                expect(function() {
                    model.children.add(model);
                }).toThrow();
            });
        });

        describe('define', function() {
            var root;

            beforeEach(function() {
                root = new c.models.BranchNodeModel;
            });

            it('branch node', function() {
                var b = root.define({concept: 1}, {type: 'branch'});

                expect(b.path()).toEqual([]);

                expect(root.toJSON()).toEqual({
                    type: 'and',
                    children: [{
                        concept: 1,
                        type: 'and',
                        children: []
                    }]
                });

                var c = b.define({
                    concept: 1,
                    field: 5,
                    operator: 'gt',
                    value: 20
                }, {type: 'condition'});

                expect(c.path()).toEqual([{concept: 1}]);

                expect(root.toJSON()).toEqual({
                    type: 'and',
                    children: [{
                        concept: 1,
                        type: 'and',
                        children: [{
                            concept: 1,
                            field: 5,
                            operator: 'gt',
                            value: 20
                        }]
                    }]
                });
            });

            it('condition node', function() {
                root.define({concept: 1, field: 5}, {type: 'condition'});
                expect(root.toJSON()).toEqual({
                    type: 'and',
                    children: [{
                        concept: 1,
                        field: 5
                    }]
                });
            });
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

});
