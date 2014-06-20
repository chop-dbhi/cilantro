/* global define */

define ([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    './base'
], function($, _, Backbone, Marionette, base) {

    // Returns a function closure that can be used to sort by attribute
    // values for a collection of models.
    var sortModelAttr = function(attr) {
        return function(model) {
            var value = model.get(attr);
            if (_.isString(value)) {
                value = value.toLowerCase();
            }
            return value;
        };
    };

    // Model with minimal parsing for unpacking the source value contained
    // with an array.
    var BarModel = Backbone.Model.extend({
        parse: function(attrs) {
            attrs.value = attrs.values[0];
            return attrs;
        }
    });

    /*
     * Collection of models representing the distribution data. Includes
     * a method for sorting models by an attriute. If the attribute is
     * prefixed with a hyphen '-', the sort will be reversed (descending).
     * This triggers the 'sort' event unless the 'silent' option is true.
     */
     var BarCollection = Backbone.Collection.extend({
        model: BarModel,

        comparator: function(model) {
            return -model.get('count');
        },

        sortModelsBy: function(attr) {
            var reverse = attr.chartAt(0);
            if (reverse === '-') {
                attr = attr.slice(1);
            }
            this.models = this.sortBy(sortModelAttr(attr));

            if (reverse === '-') {
                this.models.reverse();
            }

            this.trigger('sort', this);
        }
    });

    // View rendering the data in BarModel including stats relative to the
    // 'total' option such as the percentile of its 'count'. Bars have
    // 'selected' and 'visibility' properties, both of which can be toggled.
    var Bar = Marionette.ItemView.extend({
        className: 'info-bar',

        template: 'controls/infograph/bar',

        options: {
            total: null
        },

        ui: {
            bar: '.bar',
            barLabel: '.bar-label'
        },

        events: {
            'click': 'toggleSelected'
        },

        modelEvents: {
            'change:selected': 'setSelected',
            'change:visible': 'setVisible'
        },

        initialize: function() {
            _.bindAll(this, 'onExcludedChange');

            this.listenTo(this.model.collection, 'change:excluded',
                          this.onExcludedChange);
        },

        serializeData: function() {
            var attrs = this.model.toJSON();
            attrs.value = attrs.values[0];

            var percentage = this.getPercentage();
            attrs.width = percentage;

            // Simplify percentages that are less than one to be represented as
            // such rather than a small floating point.
            if (percentage < 1) {
                attrs.percentage = '<1';
            }
            else {
                attrs.percentage = parseInt(percentage);
            }

            return attrs;
        },

        onRender: function() {
            this.setSelected(this.model, !!this.model.get('selected'));

            if (this.ui.barLabel.html() === '') {
                this.ui.barLabel.html('(empty)');
            }

            if (this.ui.barLabel.html() === 'null') {
                this.ui.barLabel.html('(null)');
            }
        },

        // Returns the percentage of the value's count relative to the 'total'
        getPercentage: function() {
            return (this.model.get('count') / this.options.total) * 100;
        },

        // Toggle the selected state of the bar
        toggleSelected: function() {
            this.model.set('selected', !this.model.get('selected'));
        },

        onExcludedChange: function() {
            this.$el.toggleClass('excluded', this.model.get('excluded'));
        },

        // Sets the selected state of the bar. If the bar is filtered,
        // deselecting it will hide the bar from view.
        setSelected: function(model, value) {
            this.$el.toggleClass('selected', value);

            if (!value && model.get('visible') === false) {
                this.$el.removeClass('filtered').hide();
            }
        },

        // Sets the visibility of the bar based on its current state.
        setVisible: function(model, value) {
            if (value) {
                this.$el.removeClass('filtered').show();
            }
            else if (model.get('selected')) {
                this.$el.addClass('filtered');
            }
            else {
                this.$el.hide();
            }
        }
    });

    // Renders a series of bars for each value. This contains the value
    // count and percentage for the value.
    var Bars = base.ControlCollectionView.extend({
        className: 'info-bar-chart',

        itemView: Bar,

        itemViewOptions: function(model) {
            return {
                model: model,
                total: this.calcTotal()
            };
        },

        collectionEvents: {
            'change': 'change',
            'sort': 'sortChildren'
        },

        initialize: function() {
            this.wait();

            var _this = this;
            // Fetch the field distribution, do not cache
            this.model.distribution(function(resp) {
                _this.collection.reset(resp.data, {parse: true});
                _this.ready();
            });
        },

        // Sums the total count across all values
        calcTotal: function() {
            var total = 0,
                counts = this.collection.pluck('count');

            for (var i = 0; i < counts.length; i++) {
                total += counts[i];
            }

            return total;
        },

        sortChildren: function() {
            // Iterate over the newly sorted models and re-appends the child
            // view relative to the new indicies.
            var _this = this;
            this.collection.each(function(model) {
                var view = _this.collection.findByModel(model);
                _this.$el.append(view.el);
            });
        },

        getField: function() {
            return this.model.id;
        },

        getOperator: function() {
            // Since all selected bars are either included or excluded, the presence
            // of a single excluded bar in those selected means that we should be
            // using the exclusive operator. Otherwise, return the inclusive operator.
            if (this.collection.where({excluded: true}).length > 0) {
                return '-in';
            }

            return 'in';
        },

        getValue: function() {
            return _.map(this.collection.where({selected: true}), function(model) {
                return model.get('value');
            });
        },

        setValue: function(values) {
            if (!values) values = [];

            // Toggle the selection based on the presence values
            this.collection.each(function(model) {
                var value = model.get('value');
                model.set('selected', values.indexOf(value) >= 0);
            });
        },

        setOperator: function(operator) {
            if (operator === '-in') {
                this.collection.each(function(model) {
                    model.set('excluded', true);
                });
                $('input[name=exclude]').attr('checked', true);
            }
        }
    });

    // The toolbar makes it easier to interact with large lists of values. It
    // supports filtering values by text. Also, a button is provided to invert the
    // selection of values. When combined with filtering, values are selected if
    // they are not filtered by the search. The values themselves are sortable by
    // the label or the count.
    var BarChartToolbar = Marionette.ItemView.extend({
        className: 'navbar navbar-toolbar',

        template: 'controls/infograph/toolbar',

        events: {
            // Note, that no delay is used since it is working with the local list
            // of values so the filtering can keep up.
            'keyup [name=filter]': 'filterBars',
            'click [name=invert]': 'invertSelection',
            'click .sort-value-header, .sort-count-header': 'sortBy',
            'change [name=exclude]': 'excludeCheckboxChanged'
        },

        ui: {
            toolbar: '.btn-toolbar',
            filterInput: '[name=filter]',
            invertButton: '[name=invert]',
            sortValueHeader: '.sort-value-header',
            sortCountHeader: '.sort-count-header',
            excludeCheckbox: '[name=exclude]'
        },

        initialize: function() {
            this.sortDirection = '-count';
        },

        sortBy: function(event) {
            if (event.currentTarget.className === 'sort-value-header') {
                if (this.sortDirection === '-value') {
                    this.sortDirection = 'value';
                }
                else {
                    this.sortDirection = '-value';
                }
            }
            else {
                if (this.sortDirection === '-count') {
                    this.sortDirection = 'count';
                }
                else {
                    this.sortDirection = '-count';
                }
            }

            switch (this.sortDirection) {
                case '-count':
                   this.ui.sortValueHeader.html('Value <i class=icon-sort></i>');
                   this.ui.sortCountHeader.html('Count <i class=icon-sort-down></i>');
                   break;
                case 'count':
                   this.ui.sortValueHeader.html('Value <i class=icon-sort></i>');
                   this.ui.sortCountHeader.html('Count <i class=icon-sort-up></i>');
                   break;
                case '-value':
                   this.ui.sortValueHeader.html('Value <i class=icon-sort-down></i>');
                   this.ui.sortCountHeader.html('Count <i class=icon-sort></i>');
                   break;
                case 'value':
                   this.ui.sortValueHeader.html('Value <i class=icon-sort-up></i>');
                   this.ui.sortCountHeader.html('Count <i class=icon-sort></i>');
                   break;
            }

            this.collection.sortModelsBy(this.sortDirection);
        },

        toggle: function(show) {
            this.ui.filterInput.toggle(show);
            this.ui.invertButton.toggle(show);
            this.ui.sortValueHeader.toggle(show);
            this.ui.sortCountHeader.toggle(show);
        },

        // Filters the bars given a text string or via an event from the input
        filterBars: function(event) {
            var text;

            if (_.isString(event)) {
                text = event;
            }
            else {
                if (event !== null) {
                    event.stopPropagation();
                }
                text = this.ui.filterInput.val();
            }

            var regex = new RegExp(text, 'i');
            this.collection.each(function(model) {
                model.set('visible', !text || regex.test(model.get('value')));
            });
        },

        // Inverts the selected bars. If the bar is not visible and not
        // selected it will not be inverted.
        invertSelection: function() {
            this.collection.each(function(model) {
                if (model.get('visible') !== false || model.get('selected')) {
                    model.set('selected', !model.get('selected'));
                }
            });
            this.collection.trigger('change');
        },

        excludeCheckboxChanged: function() {
            var exclude = this.ui.excludeCheckbox.prop('checked');

            // If we don't set this to silent, then the change event for each
            // model will also be called on the collection. This will result in
            // an unnecessary number of change handler calls for this control.
            this.collection.each(function(model) {
                model.set('excluded', exclude, {silent: true});
            });

            // Be polite and broadcast an event to alert the bars that the
            // inclusion/exclusion status has changed and that they should now
            // update accordingly. This is necessary since we silenced the event
            // that would normally occur when we explicity set the excluded
            // attribute above.
            this.collection.trigger('change:excluded');
        }
    });

    // Infograph-style control which renders a list of horizontal bars filled based
    // on their percentage of the total population. Bars can be clicked to be selected
    // for inclusion. For small sets of values, the 'minValuesForToolbar' option
    // can be set (to an integer) to hide the toolbar.
    var InfographControl = base.ControlLayout.extend({
        template: 'controls/infograph/layout',

        events: {
            change: 'change'
        },

        options: {
            minValuesForToolbar: 10
        },

        regions: {
            bars: '.bars-region',
            toolbar: '.toolbar-region'
        },

        ui: {
            loading: '[data-target=loading-indicator]'
        },

        collectionEvents: {
            'reset': 'toggleToolbar'
        },

        initialize: function() {
            _.bindAll(this, 'toggleToolbar');
        },

        // Internally defined collection for wrapping the available values as
        // well as maintaining state for which values are selected.
        constructor: function(options) {
            if (!options.collection) options.collection = new BarCollection();

            base.ControlLayout.prototype.constructor.apply(this, arguments);

            this.barsControl = new Bars({
                model: this.model,
                collection: this.collection
            });

            var _this = this;
            // Proxy all control-based operations to the bars
            var methods = ['set', 'get', 'when', 'ready', 'wait'];
            var proxyFunc = function(method) {
                _this[method] = function() {
                    var thisControl = _this.barsControl;
                    return thisControl[method].call(thisControl, arguments);
                };

                return _this[method];
            };

            _.each(methods, function(method) {
                proxyFunc(method);
            });

            // Proxy events
            this.listenTo(this.barsControl, 'all', function() {
                var event = arguments[0];

                if (event === 'change' || event === 'beforeready' || event === 'ready') {
                    this.trigger.apply(this, arguments);
                }

                if (event === 'ready') {
                    this.ui.loading.hide();
                }
            });
        },

        toggleToolbar: function() {
            // Not yet rendered, this will be called again in onRender
            if (!this.toolbar.currentView) return;

            this.toolbar.currentView.toggle(
                this.collection.length >= this.options.minValuesForToolbar);
        },

        onRender: function() {
            this.bars.show(this.barsControl);

            this.toolbar.show(new BarChartToolbar({
                collection: this.collection
            }));

            this.toggleToolbar();
        },

        validate: function(attrs) {
            if (_.isUndefined(attrs.value) || attrs.value.length === 0) {
                return 'Select at least one value';
            }
        }
    });

    return {
        InfographControl: InfographControl
    };

});
