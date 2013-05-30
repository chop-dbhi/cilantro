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

        it('should fetch itself', function() {
            var model = new c.models.ContextNodeModel({
                field: 1,
                operator: 'exact',
                value: 30
            });

            expect(model.fetch({field: 1})).toBe(model);
        });

        it('should clear (non-fixed attributes)', function() {
            var model = new c.models.ContextNodeModel({
                concept: 1,
                field: 1,
                operator: 'exact',
                value: 30
            });
            model.clear();
            expect(model.toJSON()).toEqual({field: 1, concept: 1});
        });

        it('should trigger a change event', function() {
            var triggered = 0,
                model = new c.models.ContextNodeModel;

            model.on('change', function() {
                triggered++;
            });

            model.public.on('change', function() {
                triggered++;
            });

            model.set({
                field: 1,
                concept: 1,
                operator: 'exact',
                value: 1
            });
            expect(triggered).toBe(1);

            model.save();
            expect(triggered).toBe(2);
        });

        describe('public node', function() {
            var model;

            beforeEach(function() {
                model = new c.models.ContextNodeModel({
                    field: 1,
                    operator: 'exact',
                    value: 30
                });
            });

            it('should create a copy of the internal attributes', function() {
                expect(model.public.attributes).toEqual(model.attributes);
            });

            it('should not update on internal set', function() {
                model.set('value', 50);
                expect(model.public.toJSON()).not.toEqual(model.toJSON());
            });

            it('should update after internal save', function() {
                model.set('value', 50);
                model.save();
                expect(model.public.toJSON()).toEqual(model.toJSON());
            });

            it('should update on internal set with save option', function() {
                model.set('value', 50, {save: true});
                expect(model.public.toJSON()).toEqual(model.toJSON());
            });

            it('should not change on an invalid state', function() {
                model.set('value', null);
                model.save();
                expect(model.public.toJSON()).not.toEqual(model.toJSON());
                expect(model.public.toJSON().value).toEqual(30);
            });

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

            var cidsBefore = model.children.each(function(model) {
                return model.cid;
            });
            model.set(attrs);
            var cidsAfter = model.children.each(function(model) {
                return model.cid;
            });
            expect(model.toJSON()).toEqual(attrs);
            expect(cidsBefore).toEqual(cidsAfter);
        });

        it('should clear', function() {
            model.children.add(node);
            model.clear();
            expect(model.toJSON()).toEqual({
                type: 'and',
                children: [{
                    concept: 1,
                    field: 1,
                }, {
                    concept: 2,
                    type: 'and',
                    children: [{
                        field: 2,
                        concept: 2,
                    }]
                }, {
                    concept: 3,
                    field: 3
                }]
            });
        });

        it('should fetch child node (by field)', function() {
            model.children.add(node);
            expect(model.fetch({field: 3})).toBe(node);
        });

        it('should fetch child node (by concept)', function() {
            model.children.add(node);
            expect(model.fetch({concept: 3})).toBe(node);
        });

        it('should fetch child node (by field and concept)', function() {
            model.children.add(node);
            expect(model.fetch({field: 3, concept: 3})).toBe(node);
        });

        it('should not deep validate', function() {
            node = new c.models.ContextNodeModel({
                bad: 1
            });
            model.children.add(node);
            expect(model.isValid({deep: true})).toBe(false);
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

            model.public.on('change', function() {
                pchanged++;
            });

            model.public.children.on('add', function() {
                padded++;
            });

            model.public.children.on('remove', function() {
                premoved++;
            });

            model.set(attrs);

            expect(changed).toBe(1);
            expect(added).toBe(2);
            expect(removed).toBe(0);

            model.save();

            expect(changed).toBe(1);
            expect(added).toBe(2);
            expect(removed).toBe(0);

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

            // No save, public attributes should still be the original ones
            expect(model.public.toJSON()).toEqual(attrs);

            model.save();

            expect(changed).toBe(2);
            expect(added).toBe(2);
            expect(removed).toBe(1);

            expect(changed).toBe(2);
            expect(added).toBe(2);
            expect(removed).toBe(1);

            expect(model.public.toJSON()).toEqual(newAttrs);
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

        });

        describe('public node', function() {

            it('should equal the internal attributes on initialization', function() {
                expect(model.public.toJSON()).toEqual(model.toJSON());
            });

            it('children should contain references to internal public nodes', function() {
                var children = model.children.map(function(model) {
                    return model.public;
                });

                // For starters, ensure they are the same length
                expect(children.length).toEqual(model.public.children.length);

                for (var i = 0; i < children.length; i++) {
                    expect(children[i]).toBe(model.public.children.models[i]);
                }
            });

            it('should update on successful save', function() {
                model.children.add(node);
                expect(model.public.toJSON()).not.toEqual(model.toJSON());

                expect(model.save()).toBe(true);
                expect(model.public.toJSON()).toEqual(model.toJSON());
            });

            it('should update on internal set and save option', function() {
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
                var cidsBefore = model.public.children.each(function(model) {
                    return model.cid;
                });

                model.set(attrs, {save: true});

                var cidsAfter = model.public.children.each(function(model) {
                    return model.cid;
                });
                expect(model.public.toJSON()).toEqual(model.toJSON());
                expect(cidsBefore).toEqual(cidsAfter);
            });

            it('should ignore invalid children when strict is false', function() {
                model.children.add(node);
                model.save();
                expect(model.public.children.at(2)).toBeDefined();

                node.set('value', null);
                expect(model.save({strict: false})).toBe(true);
                expect(model.public.children.at(2)).toBeUndefined();
            });

            it('should not ignore invalid children', function() {
                node.set('value', null);
                model.children.add(node);

                expect(model.save({strict: true})).toBe(false);
                expect(model.public.children.at(2)).toBeUndefined();
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
