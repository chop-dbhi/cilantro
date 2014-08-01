/* global define */

define([
    'underscore',
    'marionette',
    '../base',
    '../core',
    '../../utils/numbers'
], function(_, Marionette, base, c, numbers) {

    var flattenLanguage = function(attrs, toks, type, wrap) {
        if (!attrs) return '';
        if (!toks) toks = [];
        if (wrap !== false) wrap = true;

        if (wrap) toks.push('<ul>');

        if (attrs.language) {
            toks.push('<li>' + attrs.language + '</li>');
        }
        else if (attrs.type && attrs.children.length) {
            if (type) {
                toks.push('<li><small>' + attrs.type.toUpperCase() + '</small><ul>');
            }

            _.each(attrs.children, function(child) {
                flattenLanguage(child, toks, type, false);
            });

            if (type) {
                toks.push('</ul></li>');
            }
        }

        if (wrap) toks.push('</ul>');

        return toks.join('');
    };

    var ContextFilter = Marionette.ItemView.extend({
        className: 'context-filter',

        template: 'context/filter',

        ui: {
            actions: '[data-target=actions]',
            loader: '[data-target=loader]',
            remove: '[data-action=remove]',
            enable: '[data-action=enable]',
            description: '[data-target=description]',
            required: '[data-target=required]'
        },

        events: {
            'click': 'clickShow',
            'click @ui.remove': 'clickRemove',
            'click @ui.enable': 'toggleEnabled',
        },

        modelEvents: {
            request: 'showLoadView',
            sync: 'hideLoadView',
            error: 'hideLoadView',
            change: 'render'
        },

        // This dictionary maps operators to their simple language representation.
        // renderDescription creates the language to be displayed as the filter
        // description. The first value in the array is the simple language
        // shortening. The second is the value present in the default language.
        simpleLanguage : {
            'in': ['is', 'is'],
            '-in': ['not', 'is not'],
            'exact': ['is', 'is'],
            'range': ['between', 'is between'],
            '-range': ['not between', 'is not between'],
            'isnull': ['is', 'is'],
            'gt': ['>', 'is greater'],
            'gte': ['>=', 'is greater than or equal to'],
            'lt': ['<', 'is less'],
            'lte': ['<=', 'is less than or equal to']
        },

        // Navigate to query page when a concept is triggered
        clickShow: function() {
            c.trigger(c.CONCEPT_FOCUS, this.model.get('concept'));
        },

        clickRemove: function(event) {
            event.stopPropagation();
            this.model.unapply();
        },

        // Toggle the enabled state of the node
        toggleEnabled: function(event) {
            event.stopPropagation();
            this.model.toggleEnabled();
        },

        renderEnabled: function() {
            this.$el.removeClass('disabled');
            this.ui.enable.attr('title', 'Disable');
            this.ui.enable.prop('checked', true);
        },

        renderDisabled: function() {
            this.$el.addClass('disabled');
            this.ui.enable.attr('title', 'Enable');
            this.ui.enable.prop('checked', false);
        },

        renderState: function() {
            if (this.model.get('enabled') !== false) {
                this.renderEnabled();
            }
            else {
                this.renderDisabled();
            }
        },

        // Function for handling values which are not from the 'range'
        // operator. This function creates an appropriate language to represent
        // the values.
        parseValue: function(value, operator) {
            var i, text = [];

            if (!_.isArray(value)) {
                if (typeof value.label !== 'undefined') {
                    value = value.label;
                }
                return '<span class=filter-value>' + value + '</span>';
            }

            // If the # of values are greater than this threshold, do not show
            // them all.
            var THRESHOLD = c.config.get('maxFilterDisplayValues');

            if (typeof value[0] === 'object') {
                value = _.pluck(value, 'label');
            }

            if (value.length === 1) {
                return '<span class=filter-value>' + value[0] + '</span>';
            }

            if (value.length < THRESHOLD) {
                // In the case of more than one values, construct a string in
                // the form [fieldname] is [value1], [value2] or [value3] etc.
                for (i = 0; i < value.length - 1; i++) {
                    text.push('<span class=filter-value>' + value[i] + ',' +
                              '</span>');
                }

                // In case of an exclusion operator, end the list of values with
                // 'nor'.
                if (operator.charAt(0) === '-') {
                    text.push('nor');
                }
                else {
                    text.push('or');
                }

                text.push('<span class=filter-value>' + value[value.length - 1] +
                          '</span>');
            }
            // In the case # of values exceeds Threshold hide them.
            else {
                text.push('<span class=filter-value>' + value[0] + ',' + '</span>');
                text.push('<span class=filter-value>' + value[1] + ',' + '</span>');

                var tail = value.length - THRESHOLD;

                if (operator.indexOf('-') < 0) {
                    text.push('...(' + tail + ' more) or');
                }
                else {
                    text.push('...(' + tail + ' more) nor');
                }

                text.push('<span class=filter-value>' + value[value.length - 1] +
                          '</span>');
            }

            return text.join(' ');
        },

        renderDescription: function() {
            var attrs = this.model.toJSON();

           /*
            * styleFilters is a feature supported by Avocado versions 2.3.5 and above.
            * If this property is not present, then the latest version
            * is not installed on this app.
            * In this case, (or in the case of not watching styled filters,
            * set this setting to false.
            */
            if (!c.config.get('styleFilters')) {
                this.ui.description.html(flattenLanguage(attrs));
                return;
            }

           /*
            * The cleanedValue will be used to prettify the language.
            * In the case of some values being represented as ids, cleanedValue
            * will provide their text representation.
            */
            var cleanedValue = attrs.cleaned_value; // jshint ignore:line

            var text = [],
                value = attrs.value,
                operator = attrs.operator,
                fieldName = '';

            if (typeof cleanedValue === 'undefined'){
                cleanedValue = value;
            }

            // If the fields have been found, get the fieldName from them. Else
            // split the language at the operator to retrive it.
            if (c.data.fields.get(attrs.field)) {
                fieldName = c.data.fields.get(attrs.field).get('name');
            }
            else {
                // Splits the language at the operator and retrives the fieldName
                // which is always to the left of the operator.
                fieldName =
                    attrs.language.split(
                            this.simpleLanguage[operator][1])[0];
            }

            // Remove ? and ! from the end of field names
            fieldName = fieldName.replace(/[!?]$/g, '');

            text.push('<ul><li>');

            text.push('<strong>' + fieldName + '</strong>');

            if (operator === 'range' || operator === '-range') {
                text.push(this.simpleLanguage[operator][0]);
                var val1 = value[0];
                var val2 = value[1];

                // Prettify Numbers
                if (_.isNumber(val1) && _.isNumber(val2)) {
                    val1 = numbers.toDelimitedNumber(val1);
                    val2 = numbers.toDelimitedNumber(val2);
                }

                text.push('<span class=filter-value>' + val1 + '</span> and ' +
                          '<span class=filter-value>' + val2 + '</span>');
            }
            else if (operator === 'in' || operator === '-in') {
                text.push(this.simpleLanguage[operator][0]);
                text.push(this.parseValue(cleanedValue, operator));
            }
            // Handles greater than, less than etc.
            else {
                text.push(this.simpleLanguage[operator][0]);
                text.push(this.parseValue(cleanedValue, operator));
            }

            text.push('</li></ul>');

            this.ui.description.html(text.join(' '));
        },

        showLoadView: function() {
            this.ui.loader.show();
            this.ui.description.hide();
        },

        hideLoadView: function() {
            this.ui.loader.hide();
            this.ui.description.show();
        },

        onRender: function() {
            // Required filters cannot be removed nor disabled
            this.ui.actions.toggle(!this.model.get('required'));
            this.ui.enable.toggle(!this.model.get('required'));
            this.ui.required.toggle(this.model.get('required') === true);

            this.ui.required.tooltip({
                container: 'body',
                placement: 'left',
                delay: 500
            });

            this.renderDescription();
            this.renderState();
        }
    });


    var ContextNoFilters = base.EmptyView.extend({
        template: 'context/empty',

        ui: {
            noFiltersResultsMessage: '.no-filters-results-workspace',
            noFiltersQueryMessage: '.no-filters-query-workspace'
        },

        onRender: function() {
            this.listenTo(c.router, 'route', this.toggleMessage);
            this.toggleMessage();
        },

        onClose: function() {
            this.stopListening(c.router);
        },

        toggleMessage: function() {
            if (c.router.isCurrent('results')) {
                this.ui.noFiltersQueryMessage.hide();
                this.ui.noFiltersResultsMessage.show();
            }
            else if (c.router.isCurrent('query')) {
                this.ui.noFiltersQueryMessage.show();
                this.ui.noFiltersResultsMessage.hide();
            }
        }
    });


    var ContextFilters = Marionette.CollectionView.extend({
        itemView: ContextFilter,

        emptyView: ContextNoFilters
    });


    return {
        ContextFilter: ContextFilter,
        ContextFilters: ContextFilters,
        ContextNoFilters: ContextNoFilters,
        flattenLanguage: flattenLanguage
    };


});
