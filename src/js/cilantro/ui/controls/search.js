/* global define */

define([
    'underscore',
    'marionette',
    './base',
    '../../models',
    '../pagination',
    '../values',
], function(_, Marionette, controls, models, pagination, values) {

    // Single item from the list of available items. This takes
    // a `values` collection that represents values that have been
    // selected. The state of this item will be toggled based on
    // whether it has been to `values` or not.
    var SearchItem = Marionette.ItemView.extend({
        className: 'value-item',

        template: 'controls/search/item',

        ui: {
            actions: '.actions',
            addButton: '.add-item-button',
            removeButton: '.remove-item-button'
        },

        events: {
            'click .add-item-button': 'addItem',
            'click .remove-item-button': 'removeItem'
        },

        constructor: function(options) {
            options = options || {};

            if ((this.values = options.values)) {
                this.listenTo(this.values, 'add', this.setState);
                this.listenTo(this.values, 'remove', this.setState);
                this.listenTo(this.values, 'reset', this.setState);
            }

            Marionette.ItemView.prototype.constructor.call(this, options);
        },

        addItem: function() {
            // Mark as valid since it was derived from a controlled list
            var attrs = _.extend(this.model.toJSON(), {valid: true});
            this.values.add(attrs);
        },

        removeItem: function() {
            this.values.remove(this.model);
        },

        setState: function() {
            if (!!this.values.get(this.model)) {
                this.ui.addButton.hide();
                this.ui.removeButton.show();
            } else {
                this.ui.addButton.show();
                this.ui.removeButton.hide();
            }
        },

        onRender: function() {
            this.setState();
        }
    });


    var SearchItems = pagination.PaginatedItems.extend({
        className: 'value-list',

        itemView: SearchItem,

        initialize: function(options) {
            this.values = options.values;
        },

        // Pass values to each item.
        // TODO have this parent view update children as the values change?
        itemViewOptions: function() {
            return {
                values: this.values
            };
        }
    });


    var SearchControl = controls.ControlLayout.extend({
        className: 'field-value-search',

        template: 'controls/search/layout',

        regions: {
            search: '.search-region',
            paginator: '.paginator-region',
            browse: '.browse-region',
            values: '.values-region'
        },

        regionViews: {
            search: pagination.PaginationSearch,
            paginator: pagination.PaginationToolbar,
            browse: SearchItems,
            values: values.ValueList
        },

        initialize: function() {
            // Initialize a new collection of values for use by the
            // two regions. This is shared between the source data
            // and the selected values for toggling state changes.
            this._values = new models.Values();

            // Initialize paginated collection of items that values can
            // be selected from. Pass the values collection in to enable
            // the available items to react to the changes.
            this.items = new models.PaginatedCollection(null, {
                model: models.Value,
                field: this.model,
                values: this._values
            });

            // Both the values collection and available items need the URL
            var valuesUrl = this.model.links.values;

            this._values.url = function() {
                return valuesUrl;
            };

            this.items.url = function() {
                return valuesUrl;
            };

            // Trigger a change event on all values events
            this.listenTo(this._values, 'all', this.change);
        },

        onRender: function() {
            var searchRegion = new this.regionViews.search({
                collection: this.items,
                placeholder: 'Search ' + this.model.get('plural_name') + '...'
            });

            var browseRegion = new this.regionViews.browse({
                collection: this.items,
                values: this._values
            });

            var paginatorRegion = new this.regionViews.paginator({
                className: 'paginator mini',
                collection: this.items
            });

            var valuesRegion = new this.regionViews.values({
                collection: this._values
            });

            // Fetch
            this.items.fetch();

            this.search.show(searchRegion);
            this.browse.show(browseRegion);
            this.paginator.show(paginatorRegion);
            this.values.show(valuesRegion);
        },

        getField: function() {
            if (this.model) return this.model.id;
        },

        // This is currently always an 'in', however 'not in' may be
        // desirable as well.
        getOperator: function() {
            return 'in';
        },

        // Returns an array of objects with value and label attributes.
        // These are returned as is to enable correct repopulation.
        getValue: function() {
            return this._values.toJSON();
        },

        setValue: function(value) {
            // Do not merge into existing models since the collection contains
            // additional state (which would be removed due to the merge).
            this._values.set(value, {merge: false});
        }

    });

    return {
        SearchControl: SearchControl,
    };

});
