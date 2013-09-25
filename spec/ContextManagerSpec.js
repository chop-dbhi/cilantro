define(['cilantro'], function (c) {

    describe('ContextManager', function() {
        var model, manager;

        beforeEach(function() {
            model = new c.models.ContextModel(null, {
                url: '/mock/context.json'
            });
            manager = model.manager;
        });

        describe('Define', function() {
            it('branch node', function() {
                var node = manager.define({concept: 1}, {type: 'branch'});

                // Default states
                expect(node.isDirty()).toBe(false);
                expect(node.isNew()).toBe(true);
                expect(node.isValid()).toBe(true);
                expect(node.isEnabled()).toBe(false);
            });

            it('condition node', function() {
                var node = manager.define({concept: 1, field: 5}, {type: 'condition'});

                // Default states
                expect(node.isDirty()).toBe(false);
                expect(node.isNew()).toBe(true);
                expect(node.isValid()).toBe(false);
                expect(node.isEnabled()).toBe(false);
            });
        });

        describe('Serialization', function() {
            it('should serialize an empty upstream', function() {
                expect(manager.toJSON()).toEqual({
                    type: 'and',
                    children: []
                });
            });
        });

        describe('Apply', function() {
            var b;
            beforeEach(function() {
                b = manager.define({concept: 1}, {type: 'branch'});
            });

            it('initial', function() {
                expect(manager.toJSON()).toEqual({
                    type: 'and',
                    children: []
                });
            });

            it('apply branch', function() {
                b.apply();

                // no change since an empty branch is not valid
                expect(manager.toJSON()).toEqual({
                    type: 'and',
                    children: []
                });
            });

            it('nested condition', function() {
                var c = b.define({
                    concept: 1,
                    field: 5,
                    operator: 'in',
                    value: [1, 2]
                }, {type: 'condition'});

                c.apply();

                expect(manager.toJSON()).toEqual({
                    type: 'and',
                    children: [{
                        concept: 1,
                        type: 'and',
                        children: [{
                            concept: 1,
                            field: 5,
                            operator: 'in',
                            value: [1, 2]
                        }]
                    }]
                });

                c.set('value', [3, 4]);

                c.apply();

                expect(manager.toJSON()).toEqual({
                    type: 'and',
                    children: [{
                        concept: 1,
                        type: 'and',
                        children: [{
                            concept: 1,
                            field: 5,
                            operator: 'in',
                            value: [3, 4]
                        }]
                    }]
                });
            });
        });

        describe('Apply Session', function() {

            it('upstream should be empty', function() {
                expect(manager.toJSON()).toEqual({
                    type: 'and',
                    children: []
                });

                var b = manager.working.define({concept: 1}, {type: 'branch'});

                expect(manager.working.toJSON()).toEqual({
                    type: 'and',
                    children: [{
                        concept: 1,
                        type: 'and',
                        children: []
                    }]
                });

                b.apply();

                expect(manager.toJSON()).toEqual({
                    type: 'and',
                    children: []
                });

            });

        });

        describe('Set', function() {
            it('simple', function() {
                manager.set({
                    type: 'or',
                    children: []
                });

                expect(manager.working.toJSON()).toEqual({
                    type: 'or',
                    children: []
                });
            });

            it('complex', function() {
                var b1 = manager.define({concept: 1}, {type: 'branch'}),
                    b2 = manager.define({concept: 2}, {type: 'branch'});

                b1.define({
                    concept: 1,
                    field: 1,
                    value: 50,
                    operator: 'gt'
                }, {type: 'condition'});

                b2.define({
                    concept: 2,
                    field: 2,
                    value: [1, 2],
                    operator: 'in'
                }, {type: 'condition'});

                // pre-set working tree
                expect(manager.working.toJSON()).toEqual({
                    type: 'and',
                    children: [{
                        concept: 1,
                        type: 'and',
                        children: [{
                            concept: 1,
                            field: 1,
                            operator: 'gt',
                            value: 50
                        }]
                    }, {
                        concept: 2,
                        type: 'and',
                        children: [{
                            concept: 2,
                            field: 2,
                            operator: 'in',
                            value: [1, 2]
                        }]
                    }]
                });

                // pre-set upstream tree
                expect(manager.upstream.toJSON()).toEqual({
                    type: 'and',
                    children: []
                });

                // set
                manager.set({
                    type: 'and',
                    children: [{
                        concept: 1,
                        type: 'and',
                        children: [{
                            concept: 1,
                            field: 1,
                            operator: 'gt',
                            value: 50,
                            warnings: ['out of bounds']
                        }]
                    }, {
                        concept: 2,
                        type: 'and',
                        children: []
                    }]
                });

                // post-set working tree
                expect(manager.working.toJSON()).toEqual({
                    type: 'and',
                    children: [{
                        concept: 1,
                        type: 'and',
                        children: [{
                            concept: 1,
                            field: 1,
                            operator: 'gt',
                            value: 50,
                            warnings: ['out of bounds']
                        }]
                    }, {
                        concept: 2,
                        type: 'and',
                        children: [{
                            concept: 2,
                            field: 2,
                            operator: 'in',
                            value: [1, 2]
                        }]
                    }]
                });

                // post-set upstream tree
                expect(manager.upstream.toJSON()).toEqual({
                    type: 'and',
                    children: [{
                        concept: 1,
                        type: 'and',
                        children: [{
                            concept: 1,
                            field: 1,
                            operator: 'gt',
                            value: 50,
                            warnings: ['out of bounds']
                        }]
                    }, {
                        concept: 2,
                        type: 'and',
                        children: []
                    }]
                });

                manager.set(null);

                // post-set working tree
                expect(manager.working.toJSON()).toEqual({
                    type: 'and',
                    children: [{
                        concept: 1,
                        type: 'and',
                        children: [{
                            concept: 1,
                            field: 1,
                            operator: 'gt',
                            value: 50,
                            warnings: ['out of bounds']
                        }]
                    }, {
                        concept: 2,
                        type: 'and',
                        children: [{
                            concept: 2,
                            field: 2,
                            operator: 'in',
                            value: [1, 2]
                        }]
                    }]
                });

                // post-set upstream tree
                expect(manager.upstream.toJSON()).toEqual({
                    type: 'and',
                    children: []
                });
            });

        });

    });
});
