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
            notNullOption: '[data-target=not-null-option]',
            filterHelp: '.filter-help'
        },

        events: {
            'change [data-target=null-selector]': 'change',
            'change': 'showFilterHelp'
        },

        showFilterHelp: function() {
           var language = {
                'true': ' is null',
                'false': ' is not null'
           };
           var attrName = this.model.attributes.name;

           this.ui.filterHelp.text(attrName + language[this.getValue()]);
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
