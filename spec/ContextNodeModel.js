define(['cilantro'], function (c) {

    describe('ContextNodeModel (base class)', function() {

        it('should validate as condition', function() {
            var model = new c.models.ContextNodeModel({
                field: 1,
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

            expect(model.isValid({strict: false})).toBe(true);
        });

        it('should validate as composite', function() {
            var model = new c.models.ContextNodeModel({
                composite: 1
            });
            expect(model.isValid()).toBe(true);
        });

        it('should find itself', function() {
            var model = new c.models.ContextNodeModel({
                field: 1,
                operator: 'exact',
                value: 30
            });

            expect(model.find({field: 1})).toBe(model);
        });

        it('should clear non-IDs', function() {
            var model = new c.models.ContextNodeModel({
                field: 1,
                operator: 'exact',
                value: 30
            });

            model.clear();
            expect(model.attributes).toEqual({field: 1});
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
            var c1_0 = c1.children.at(0);
            expect(c0 instanceof c.models.ConditionNodeModel).toBe(true);
            expect(c1 instanceof c.models.BranchNodeModel).toBe(true);
            expect(c1_0 instanceof c.models.ConditionNodeModel).toBe(true);
        });

        it('should validate (shallow)', function() {
            expect(model.isValid({deep: false})).toBe(true);
        });

        it('should validate (deep)', function() {
            model.children.add(node);
            expect(model.isValid({deep: true})).toBe(true);
        });

        it('should set and merge', function() {
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

        it('should not deep validate', function() {
            node = new c.models.ContextNodeModel({
                bad: 1
            });
            model.children.add(node);
            expect(model.isValid({deep: true})).toBe(false);
        });

        it('should clear children', function() {
            model.clear()
            expect(model.toJSON()).toEqual({
                type: 'and',
                children: [{
                    field: 1,
                    concept: 1,
                }, {
                    concept: 2,
                    type: 'and',
                    children: [{
                        field: 2,
                        concept: 2,
                    }]
                }]
            })
        });

        it('should clear and reset children', function() {
            model.clear({reset: true})
            expect(model.toJSON()).toEqual({
                type: 'and',
                children: []
            })
        });

        it('should trigger change events', function() {
            var model = new c.models.BranchNodeModel,
                changed = 0,
                added = 0,
                removed = 0,
                pchanged = 0,
                padded = 0,
                premoved = 0;

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

            model.on('change', function() {
                changed++;
            });

            model.children.on('add', function() {
                added++;
            });

            model.children.on('remove', function() {
                removed++;
            });

            model.set(attrs);

            expect(changed).toBe(1);
            expect(added).toBe(2);
            expect(removed).toBe(0);

            model.save();

            expect(changed).toBe(1);
            expect(added).toBe(2);
            expect(removed).toBe(0);

            var newAttrs = {
                type: 'and',
                children: [{
                    field: 1,
                    concept: 1,
                    value: 50,
                    operator: 'gt'
                }]
            };

            model.set(newAttrs);

            expect(changed).toBe(2);
            expect(added).toBe(2);
            expect(removed).toBe(1);

            model.save();

            expect(changed).toBe(2);
            expect(added).toBe(2);
            expect(removed).toBe(1);

            expect(changed).toBe(2);
            expect(added).toBe(2);
            expect(removed).toBe(1);

            expect(model.isDirty()).toBe(false);
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

            it('should not add bare invalid attributes', function() {
                expect(function() {
                    model.children.add({bad: 1});
                }).toThrow();
            });

            it('should ignore invalid children when strict is false', function() {
                model.children.add(node);
                model.save();

                node.set('value', null);
                expect(model.save({strict: false})).toBe(true);
            });

            it('should not ignore invalid children', function() {
                node.set('value', null);
                model.children.add(node);

                expect(model.save({strict: true})).toBe(false);
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
