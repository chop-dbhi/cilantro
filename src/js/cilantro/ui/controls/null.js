/* global define */

define([
    './base'
], function (base) {

    // Null selector filtering on whether or not a field is null
    var NullSelector = base.Control.extend({
        template: 'controls/null/layout',

        ui: {
            select: '[data-target=null-selector]',
            nullOption: '[data-target=null-option]',
            notNullOption: '[data-target=not-null-option]'
        },

        events: {
            'change [data-target=null-selector]': 'change'
        },

        initialize: function () {
            this.on('ready', this.change);
        },

        onRender: function () {
            if (this.options.isNullLabel) {
                this.ui.nullOption.text(this.options.isNullLabel);
            }
            if (this.options.isNotNullLabel) {
                this.ui.notNullOption.text(this.options.isNotNullLabel);
            }
        },

        getOperator: function () {
            return 'isnull';
        },

        getValue: function () {
            return this.ui.select.val() === 'true';
        },

        setValue: function (value) {
            this.ui.select.val(value.toString());
        }
    });

    return {
        NullSelector: NullSelector
    };

});
