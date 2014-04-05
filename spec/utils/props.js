/* global define, describe, it, expect */

define(['cilantro/utils'], function(utils) {

    describe('Utils', function() {

        describe('getDotProp', function() {
            it('should get', function() {
                var obj = {
                    one: 1,
                    two: {
                        a: 2
                    }
                };
                expect(utils.getDotProp(obj, 'one')).toEqual(1);
                expect(utils.getDotProp(obj, 'two')).toEqual({a: 2});
                expect(utils.getDotProp(obj, 'two.a')).toEqual(2);
                expect(utils.getDotProp(obj, 'two.a.b')).toBeUndefined();
                expect(utils.getDotProp(obj, 'two.a.b', 'default')).toEqual('default');
            });
        });

        describe('setDotProp', function() {
            it('should set', function() {
                var obj = {};

                utils.setDotProp(obj, 'one', 1);
                utils.setDotProp(obj, 'two.a', 2);

                expect(obj).toEqual({
                    one: 1,
                    two: {
                        a: 2
                    }
                });
            });
        });

    });
});
