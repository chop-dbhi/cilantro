/* global define, describe, it, expect */

define(['cilantro'], function(c) {

    describe('Utils', function() {

        describe('toSuffixedNumber', function() {

            it('should return undefined for empty value', function() {
                expect(c.utils.toSuffixedNumber()).toBe(undefined);
            });

            it('should return value when < 1000', function() {
                expect(c.utils.toSuffixedNumber(123.45)).toBe('123.45');
            });

            it('should suffix numbers', function() {
                var suffixes = [
                    [3, 'K'],
                    [6, 'million'],
                    [9, 'billion'],
                    [12, 'trillion'],
                    [15, 'quadrillion'],
                    [18, 'quintillion'],
                    [21, 'sextillion'],
                    [24, 'septillion'],
                    [27, 'octillion'],
                    [30, 'nonillion'],
                    [33, 'decillion'],
                    [100, 'googol']
                ];

                for (var i = 0; i < suffixes.length; i++) {
                    var exp = suffixes[i][0],
                        suffix = suffixes[i][1];

                    expect(c.utils.toSuffixedNumber(Math.pow(10, exp))).toBe('1 ' + suffix);
                }
            });

        });

        describe('toDelimitedNumber', function() {

            it('should return undefined for empty value', function() {
                expect(c.utils.toDelimitedNumber()).toBe(undefined);
            });

            it('should use comma as default delimiter', function() {
                expect(c.utils.toDelimitedNumber(1000000)).toBe('1,000,000');
            });

            it('should respect custom delimiters', function() {
                expect(c.utils.toDelimitedNumber(1000000, '/')).toBe('1/000/000');
            });

            it('should include decimal portion', function() {
                expect(c.utils.toDelimitedNumber(1234.5678)).toBe('1,234.5678');
            });

        });

        describe('prettyNumber', function() {

            it('should return undefined for empty value', function() {
                expect(c.utils.prettyNumber()).toBe(undefined);
            });

            it('should use exponential for small floats', function() {
                expect(c.utils.prettyNumber(0.000001)).toBe('1.00e-6');
            });

            it('should round big floats', function() {
                expect(c.utils.prettyNumber(1.23456789)).toBe('1.23');
            });

        });

    });

});
