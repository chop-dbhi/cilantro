/* global define */

/* Utilities to formating numbers in a human-readable way.
 *
 *  - toSuffixedNumber - for numbers greater than or equal to 1000,
 *      the output is a suffixed number
 *  - toDelimitedNumber - returns a delimited string representation
 *      of the number
 *  - prettyNumber - attempts to return a number either rounded and/or
 *      suffixed, appropriate for the value
 */

define(function() {

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

    var parsable = function(value) {
        return !(value === undefined || value === null || value === '');
    };

    var toSuffixedNumber = function(value, threshold) {
        if (!parsable(value)) return;

        // If our number is less than the set threshold,
        // do not proceed with rounding or making it pretty
        if (value < 1000 && (threshold === null || threshold === undefined)) {
            return toDelimitedNumber(value);
        }
        else if (value <= threshold){
            return value;
        }

        var exp, suffix, largeNum, newValue;
        for (var i = 0; i < suffixes.length; i++) {
            exp = suffixes[i][0];
            suffix = suffixes[i][1];

            largeNum = Math.pow(10, exp);

            if (value < largeNum * 1000) {
                newValue = Math.round(value / largeNum * 10) / 10;
                return '' + newValue + ' ' + suffix;
            }
        }
    };

    var toDelimitedNumber = function(value, delim) {
        if (!parsable(value)) return;

        if (delim === undefined) delim = ',';

        var valueParts = value.toString().split('.'),
            intPart = valueParts[0],
            decimalPart = valueParts[1],
            arr = intPart.toString().split(''),
            len = arr.length,
            i = len % 3 || 3;

        while (i < len) {
            arr.splice(i, 0, delim);
            i += 4;
        }

        var text = arr.join('');
        if (decimalPart) {
            text += '.' + decimalPart;
        }

        return text;
    };

    var prettyNumber = function(value, threshold) {
        if (!parsable(value)) return;

        if (value !== 0) {
            // Small float
            if (Math.abs(value) < 0.01) {
                return value.toExponential(2);
            }
            // Other floats
            if (Math.round(value) !== value) {
                value = value.toPrecision(3);
            }
        }

        return toSuffixedNumber(value, threshold);
    };

    return {
        toSuffixedNumber: toSuffixedNumber,
        toDelimitedNumber: toDelimitedNumber,
        prettyNumber: prettyNumber
    };

});
