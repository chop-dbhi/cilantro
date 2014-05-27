/* global define */

define([
    'underscore',
    './range'
], function(_, range) {

    var DateControl = range.RangeControl.extend({
        // Add the change event from the datepickers to existing range events
        events: function() {
            return _.extend({
                'changeDate .range-lower,.range-upper': '_change'
            }, range.RangeControl.prototype.events);
        },

        onRender: function() {
            range.RangeControl.prototype.onRender.apply(this, arguments);

            // Initialize the datepickers and make them close automatically
            this.ui.lowerBound.datepicker({'autoclose': true});
            this.ui.upperBound.datepicker({'autoclose': true});
        },

        // Sets the placeholder value on the supplied element to the date value
        _setPlaceholder: function(element, value) {
            // String off the time data if it is included.
            var dateStr = value.replace(/T.*$/, '');

            // Currently the string is in yyyy-mm-dd so we need to split it up
            // and reorder the properties.
            var dateFields = dateStr.split('-');

            // Unless there are exaclty 3 fields we will leave the place holder
            // as it is now rather than trying to figure out what malformed
            // input we are trying to use.
            if (dateFields.length === 3) {
                dateStr = '' + dateFields[1] + '/' + dateFields[2] + '/' + dateFields[0];
                element.attr('placeholder', dateStr);
            }
        },

        // Override the default behavior so the date is formatted correctly
        // for use in the placeholder.
        setLowerBoundPlaceholder: function(value) {
            this._setPlaceholder(this.ui.lowerBound, value);
        },

        // Override the default behavior so the date is formatted correctly
        // for use in the placeholder.
        setUpperBoundPlaceholder: function(value) {
            this._setPlaceholder(this.ui.upperBound, value);
        },
    });

    return {
        DateControl: DateControl
    };

});
