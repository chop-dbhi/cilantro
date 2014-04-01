/* global define */

define([
    './range'
], function(range) {

    // A control for entering an inclusive or exclusive numeric range
    var NumberControl = range.RangeControl.extend({

        // Cast the lower bound to a number for use in the getValue() method
        getLowerBoundValue: function() {
            var value = this.ui.lowerBound.val().trim();
            if (value) return parseFloat(value);
        },

        // Cast the upper bound to a number for use in the getValue() method
        getUpperBoundValue: function() {
            var value = this.ui.upperBound.val().trim();
            if (value) return parseFloat(value);
        }

    });


    return {
        NumberControl: NumberControl
    };

});
