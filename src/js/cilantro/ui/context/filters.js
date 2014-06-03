/* global define */

define([
    'underscore',
    'marionette',
    '../base',
    '../core',
], function(_, Marionette, base, c) {

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

        // Function for handeling values which are not of from the 'range'
        // operator. This function creates an appropriate language to represent
        // the values.
        parseValues: function(values, operator) {
            var text= [];
            // If the # of values are greater than this threshold, do not show
            // them all.
            var THRESHOLD = 5;

            if (values.length === 1) {
                text.push('<span style="color:blue">' + values[0] + '</span>');
            }

            else if (values.length < THRESHOLD) {
                for (var i=0; i < values.length-1; i++) {
                    text.push('<span style="color:blue">' + values[i] + ',' +
                              '</span>');
                }
                // In case of an exclusion operator, end the list of values with
                // 'nor'.
                if (operator.indexOf('-') < 0) text.push('or');
                else text.push('nor');

                text.push('<span style="color:blue">' + values[values.length-1] +
                          '</span>');
            }
            // In the case # of values exceeds Threshold, do not display them all.
            else {
                for (var k=0; k<3; k++) {
                    text.push('<span style="color:blue">' + values[k] + ',' +
                              '</span>');
                }

                if (operator.indexOf('-') < 0) text.push('... or');
                else text.push('... nor');

                text.push('<span style="color:blue">' + values[values.length-1] +
                          '</span>');
            }

            return text.join(' ');
        },

        renderDescription: function() {
            // The cleanedValues will be used to prettify the language.
            // In the case of some values being represented as id's, cleanedValues
            // will provide their text representation.
            var cleanedValues = this.model.attributes.cleaned_value; // jshint ignore:line

            // cleanedValues is a property returned by the latest version of
            // avocado. If this property is not present, then the latest version
            // is not installed on this app. Thus, do not attempt to prettify the
            // filter display nor simplify the language.
            if (cleanedValues === undefined) {
                var attrs = this.model.attributes;
                this.ui.description.html(flattenLanguage(attrs));
                return;
            }

            // This dictionary maps operators to their simple language representation.
            // renderDescription creates the language to be displayed as the filter
            // description.
            var simpleLanguage = {
                'in': 'is',
                '-in': 'not',
                'exact': 'is',
                'range': 'between',
                '-range':'not between',
                'gt': '>',
                'gte': '>=',
                'lt': '<',
                'lte': '<='
            };

            var noise = ['!', '?'];

            var text = [];
            var values = this.model.attributes.value;

            var operator = this.model.attributes.operator;
            var fieldName = '';

            // If the fields have been found, get the fieldName from them. Else
            // split the language at the operator to retrive it.
            if (c.data.fields.get(this.model.get('field'))) {
                fieldName = c.data.fields.get(this.model.get('field')).get('name');
            }
            else {
                // Splits the language at the operator and retrives the fieldName
                // which is always to the left of the operator.
                fieldName =
                    this.model.attributes.language.split([simpleLanguage[operator]])[0];
            }

            // Remove ? and ! from the end of field names
            for (var n in noise) {
                fieldName = fieldName.replace(noise[n], '');
            }

            text.push('<ul><li>');
            // Bold the fieldName
            text.push('<strong>'+fieldName+'</strong>');

            if (operator === 'range' || operator === '-range') {
                text.push(simpleLanguage[operator]);
                text.push('<span style="color:blue">' + values[0] + '</span> and ' +
                          '<span style="color:blue">' + values[1] + '</span>');
            }
            else if (operator === 'in' || operator === '-in') {
                text.push(simpleLanguage[operator]);

                if (cleanedValues) {
                    text.push(this.parseValues(cleanedValues, operator));
                }
                // In the case that cleanedValues don't exist, we use the regular
                // raw values.
                else {
                    if (typeof values[0] === 'object') {
                        text.push(this.parseValues(_.pluck(values, 'label'), operator));
                    }
                    else {
                        text.push(this.parseValues(values, operator));
                    }
                }
            }
            else if (operator === 'exact') {
                text.push(simpleLanguage[operator]);
                text.push('<span style="color:blue">' + cleanedValues + '</span>');
            }
            // Handles greater than, less then etc.
            else {
                text.push(simpleLanguage[operator]);
                text.push('<span style="color:blue">' + values[0] + '</span>');
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
