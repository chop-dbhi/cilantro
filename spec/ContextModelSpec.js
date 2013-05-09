define(['cilantro'], function (c) {

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

        it('should fetch itself', function() {
            var model = new c.models.ContextNodeModel({
                field: 3,
                operator: 'exact',
                value: 30
            });

            expect(model.fetch({field: 3})).toBe(model);
        });

        describe('Local vs. public attributes', function() {
            var model;
            beforeEach(function() {
                model = new c.models.ContextNodeModel({
                    field: 3,
                    operator: 'exact',
                    value: 30
                });
            });

            it('should create a copy of the internal attributes', function() {
                expect(model.publicAttributes).toEqual(model.attributes);
            });

            it('toJSON should not reflect local attributes on set', function() {
                model.set('value', 50);
                expect(model.toJSON()).not.toEqual(model.attributes);
            });

            it('toJSON should reflect local attributes after save', function() {
                model.set('value', 50);
                model.save();
                expect(model.toJSON()).toEqual(model.attributes);
            });

            it('toJSON should not change on an invalid state', function() {
                model.set('value', null);
                model.save();
                expect(model.toJSON()).not.toEqual(model.attributes);
                expect(model.toJSON().value).toEqual(30);
            });
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
            expect(model.isValid({deep: false})).toBe(true);
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
            expect(model.get('children')[0].attributes).toEqual({field: 1, concept: 1});
        });

        it('should fetch child node (by field)', function() {
            model.add(node);
            expect(model.fetch({field: 1})).toBe(node);
        });

        it('should fetch child node (by concept)', function() {
            model.add(node);
            expect(model.fetch({concept: 1})).toBe(node);
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

        describe('Deep initialization', function() {
            it('should convert descendants into nodes', function() {
                var model = new c.models.BranchNodeModel({
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
                }, {
                    deep: true
                });

                c0 = model.get('children')[0]
                c1 = model.get('children')[1]
                c1_0 = c1.get('children')[0]
                expect(c0 instanceof c.models.ConditionNodeModel).toBe(true);
                expect(c1 instanceof c.models.BranchNodeModel).toBe(true);
                expect(c1_0 instanceof c.models.ConditionNodeModel).toBe(true);
            });
        });

        describe('Local vs. Public attributes', function() {

            describe('toJSON', function() {

                it('should recurse on public attributes', function() {
                    model.add(node);

                    expect(model.toJSON()).toEqual({
                        type: 'and',
                        children: []
                    });

                    expect(model.save({deep: false})).toBe(true);

                    expect(model.toJSON()).toEqual({
                        type: 'and',
                        children: [{
                            field: 1,
                            concept: 1,
                            value: 30,
                            operator: 'exact'
                        }]
                    });
                });

                it('should not recurse unless the deep=true option is passed', function() {
                    model.add(node);
                    node.set('value', 50);
                    expect(model.save({deep: true})).toBe(true);

                    expect(model.toJSON()).toEqual({
                        type: 'and',
                        children: [{
                            field: 1,
                            concept: 1,
                            value: 50,
                            operator: 'exact'
                        }]
                    });
                });

                it('should ignore invalid children but not remove them', function() {
                    model.add(node);
                    node.set('value', null);
                    expect(model.save({ignore: true})).toBe(true);

                    expect(model.toJSON()).toEqual({
                        type: 'and',
                        children: [{
                            field: 1,
                            concept: 1,
                            value: 30,
                            operator: 'exact'
                        }]
                    });
                });

                it('should not ignore invalid children', function() {
                    model.add(node);
                    node.set('value', null);
                    expect(model.save({ignore: false})).toBe(true);

                    // Invalid node not saved
                    expect(model.toJSON()).toEqual({
                        type: 'and',
                        children: []
                    });
                });

                it('should stop processing if strict is true', function() {
                    model.add(node);
                    node.set('value', null);
                    expect(model.save({strict: true})).toBe(false);

                    expect(model.toJSON()).toEqual({
                        type: 'and',
                        children: []
                    });
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
