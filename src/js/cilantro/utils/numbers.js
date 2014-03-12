/* global define */

define([], function() {
    /* Utilities to formating numbers in a human-readable way.
     *
     *  - toSuffixedNumber - for numbers greater than or equal to 1000,
     *      the output is a suffixed number
     *  - toDelimitedNumber - returns a delimited string representation
     *      of the number
     *  - prettyNumber - attempts to return a number either rounded and/or
     *      suffixed, appropriate for the value
     */

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

    var toSuffixedNumber = function(value) {
        if (value == null) {
            return;
        }

        if (value < 1000) {
            return toDelimitedNumber(value);
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
        if (value == null) {
            return;
        }

        if (delim == null) {
            delim = ',';
        }

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

    var prettyNumber = function(value) {
        if (value == null) {
            return;
        }

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

        return toSuffixedNumber(value);
    };

    return {
        toSuffixedNumber: toSuffixedNumber,
        toDelimitedNumber: toDelimitedNumber,
        prettyNumber: prettyNumber
    };
});
