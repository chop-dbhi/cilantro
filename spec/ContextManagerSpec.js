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

                // Default states (for branch)
                expect(node.isDirty()).toBe(false);
                expect(node.isNew()).toBe(true);
                expect(node.isRemoved()).toBe(false);
                expect(node.isValid()).toBe(true);
                expect(node.isEnabled()).toBe(true);
            });

            it('condition node', function() {
                var node = manager.define({concept: 1, field: 5}, {type: 'condition'});

                // Default states (for condition)
                expect(node.isDirty()).toBe(true);
                expect(node.isNew()).toBe(true);
                expect(node.isRemoved()).toBe(false);
                expect(node.isValid()).toBe(false);
                expect(node.isEnabled()).toBe(true);
            });

            it('nodes in nested branch', function() {
                // top level
                var branch = manager.define({concept: 1}, {type: 'branch'});

                var node = branch.define({concept: 1, field: 5}, {type: 'condition'});

                // Ensure the working tree serializes
                expect(manager.find({concept: 1, field: 5})).toBe(node);
            });

            it('ignore redefinition of nodes', function() {
                manager.define({concept: 1}, {type: 'branch'});
                var node1 = manager.find({concept: 1});

                manager.define({concept: 1}, {type: 'branch'});
                var node2 = manager.find({concept: 1});

                expect(node1).toBe(node2);
            });
        });

        describe('Remove', function() {
            it('remove a node', function() {
                manager.remove();
                expect(manager.working.isRemoved()).toEqual(true);
            });
        });

        describe('Node Events', function() {
            var node;
            beforeEach(function() {
                node = manager.define({concept: 1}, {type: 'branch'});
            });

            it('should bind when defined', function() {
                expect(manager._listeners[node._listenerId]).toBeDefined();
            });

            it('should proxy events via the nodeEventPrefix', function() {
                var triggered = false;

                manager.on('node:change', function(_node, options) {
                    triggered = true;
                    expect(node).toBe(_node);
                    expect(options).toEqual({test: 1});
                });

                node.set('type', 'or', {test: 1});
                expect(triggered).toBe(true);
            });
        });

        describe('Serialization', function() {
            it('ignore dirty nodes', function() {
                var branch = manager.define({concept: 1}, {type: 'branch'});
                branch.define({concept: 1, field: 5});

                // Empty branches are recursively ignored
                expect(manager.toJSON()).toEqual(null);

                // Set a valid node, apply it
                var node = manager.find({concept: 1, field: 5});
                node.set({operator: 'exact', value: 50});
                node.apply();

                // no longer dirty
                expect(manager.toJSON()).toEqual({
                    type: 'and',
                    children: [{
                        concept: 1,
                        type: 'and',
                        children: [{
                            concept: 1,
                            field: 5,
                            operator: 'exact',
                            value: 50
                        }]
                    }]
                });
            });
        });

        describe('Update', function() {

            it('update the tree (simple)', function() {

                manager.update({
                    type: 'or',
                    children: []
                });

                expect(manager.working.toJSON()).toEqual({
                    type: 'or',
                    children: []
                });
            });

            it('update the tree', function() {
                manager.define({concept: 1}, {type: 'branch'});
                manager.define({concept: 2}, {type: 'branch'});
                manager.define({concept: 1, field: 1, value: 50, operator: 'gt'},
                    [{concept: 1}], {type: 'condition'});
                manager.define({concept: 2, field: 2, value: [1, 2], operator: 'in'},
                    [{concept: 2}], {type: 'condition'});

                // pre-update working tree
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

                // pre-update upstream tree
                expect(manager.upstream.toJSON()).toEqual({
                    type: 'and',
                    children: []
                });

                // update
                manager.update({
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

                // post-update working tree
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

                // post-update upstream tree
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
            });

        });

    });
});
