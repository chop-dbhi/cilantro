/* global define */

define([
    'underscore',
    './base',
    '../button',
    '../../constants'
], function(_, base, button, constants) {

    // A generic control for entering an inclusive or exclusive range
    var RangeControl = base.Control.extend({
        template: 'controls/range/layout',

        events: {
            'keyup .range-lower, .range-upper': '_change',
            'change .btn-select': '_change',
            'click .range-help-button': 'toggleHelpText'
        },

        ui: {
            operatorSelect: '.btn-select',
            lowerBound: '.range-lower',
            upperBound: '.range-upper',
            help: '.help-block'
        },

        initialize: function() {
            this._change = _.debounce(this.change, constants.INPUT_DELAY);
        },

        onRender: function() {
            this.operatorSelect = new button.ButtonSelect({
                collection: [{
                    value: 'range',
                    label: 'between',
                    selected: true
                }, {
                    value: '-range',
                    label: 'not between'
                }]
            });

            this.operatorSelect.render().$el.prependTo(this.$el);
            this.ui.help.hide();
            this.renderBounds();

            this.listenTo(this.model.stats, 'reset', this.renderBounds);
        },

        // Renders the lower/upper bounds of the input fields. This reads the stats
        // and then renders the input placeholders if defined.
        renderBounds: function() {
            this.readMinMaxStats();

            if (!_.isUndefined(this.minLowerBound)) {
                this.setLowerBoundPlaceholder(this.minLowerBound);
            }

            if (!_.isUndefined(this.maxUpperBound)) {
                this.setUpperBoundPlaceholder(this.maxUpperBound);
            }
        },

        // Method for parsing the lower bound value for the range.
        parseMinStat: function(value) {
            return value;
        },

        // Method for parsing the upper bound value for the range.
        parseMaxStat: function(value) {
            return value;
        },

        // If available and applicable, the minimum and maximum values of the field
        // distribution are used for display in the text inputs.
        readMinMaxStats: function() {
            var statsMin = this.model.stats.get('min'),
                statsMax = this.model.stats.get('max');

            if (!_.isUndefined(statsMin)) {
                this.minLowerBound = this.parseMinStat(statsMin.get('value'));
            }

            if (!_.isUndefined(statsMax)) {
                this.maxUpperBound = this.parseMaxStat(statsMax.get('value'));
            }
        },

        toggleHelpText: function(event) {
            event.preventDefault();
            this.ui.help.toggle();
        },

        getField: function() {
            return this.model.id;
        },

        // Uses the logical combination of the (not) between dropdown and the
        // upper/lower bounds text boxes to determine the operator for this
        // control. The help information for this control has a plain English
        // explanation of this logic.
        getOperator: function() {
            var lower = this.ui.lowerBound.val(),
                upper = this.ui.upperBound.val(),
                operator = this.operatorSelect.getSelection(),
                reverse = operator !== 'range';

            if (lower && upper) {
                operator = operator;
            }
            else if (lower) {
                operator = reverse ? 'lte' : 'gte';
            }
            else if (upper) {
                operator = reverse ? 'gte' : 'lte';
            }
            else {
                operator = undefined;
            }

            return operator;
        },

        // Method to override in the case where formatting or conversion of
        // the lower bound needs to occur before using as part of or in whole
        // for the value determined in getValue. By default, this method simply
        // returns the string representation of the lower bound lower the text
        // box input.
        getLowerBoundValue: function() {
            return this.ui.lowerBound.val();
        },

        // Method to override in the case where formatting or conversion of
        // the upper bound needs to occur before using as part of or in whole
        // for the value determined in getValue. By default, this method simply
        // returns the string representation of the upper bound lower the text
        // box input.
        getUpperBoundValue: function() {
            return this.ui.upperBound.val();
        },

        // Use the filled state of the upper/lower bound inputs to create the
        // value range or explicit value for this control. If both the upper
        // and lower bounds are left blank, null will be returned to invalidate
        // this range.
        getValue: function() {
            var value,
                lower = this.getLowerBoundValue(),
                upper = this.getUpperBoundValue();

            if (!_.isUndefined(lower) && !_.isUndefined(upper)) {
                value = [lower, upper];
            }
            else if (!_.isUndefined(lower)) {
                value = lower;
            }
            else if (!_.isUndefined(upper)) {
                value = upper;
            }

            return value;
        },

        setOperator: function(operator) {
            // All other operators (lte, gte, etc.) default to the 'range'
            // selection by default.
            if (operator !== '-range') {
                operator = 'range';
            }

            this.operatorSelect.setSelection(operator);
        },

        // This method updates the lower bound text box placeholder with the
        // supplied value. Overriding this method allows for transformations
        // of the value itself before application as well as more complex UI
        // updates beyond the default behavior. This method simply sets the
        // lower bound text box placeholder to the string supplied as the value
        // argument.
        setLowerBoundPlaceholder: function(value) {
            this.ui.lowerBound.prop('placeholder', value);
        },

        setLowerBoundValue: function(value) {
            this.ui.lowerBound.val(value);
        },

        // This method updates the upper bound text box placeholder with the
        // supplied value. Overriding this method allows for transformations
        // of the value itself before application as well as more complex UI
        // updates beyond the default behavior. This method simply sets the
        // upper bound text box placeholder to the string supplied as the value
        // argument.
        setUpperBoundPlaceholder: function(value) {
            this.ui.upperBound.prop('placeholder', value);
        },

        setUpperBoundValue: function(value) {
            this.ui.upperBound.val(value);
        },

        // Override set method due to the dependency of the operator
        // when setting the value
        set: function(attrs) {
            this.setOperator(attrs.operator);

            // Reset values prior to setting
            this.setUpperBoundValue();
            this.setLowerBoundValue();

            var value = attrs.value;

            if (_.isArray(value)) {
                if (!_.isUndefined(value[0])) this.setLowerBoundValue(value[0]);
                if (!_.isUndefined(value[1])) this.setUpperBoundValue(value[1]);
            }
            else if (!_.isUndefined(value)) {
                if (attrs.operator === 'gte') {
                    this.setLowerBoundValue(value);
                }
                else {
                    this.setUpperBoundValue(value);
                }
            }
        },

        validate: function(attrs) {
            // One of the bounds must be defined
            if (_.isUndefined(attrs.value)) {
                return 'A lower or upper value must be defined';
            }

            // The first value should not be greater than the second
            if (_.isArray(attrs.value) && attrs.value[0] > attrs.value[1]) {
                return 'The lower bound cannot be greater than the upper';
            }
        }
    });


    return {
        RangeControl: RangeControl
    };

});
