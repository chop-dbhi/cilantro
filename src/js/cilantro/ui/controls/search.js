/* global define */

define([
    'jquery',
    'underscore',
    'marionette',
    './base',
    '../../models',
    '../../constants',
    '../paginator',
    '../values',
    '../search'
], function($, _, Marionette, controls, models, constants, paginator, values, search) {

    // Single page of values
    var SearchPageModel = models.Page.extend({
        constructor: function(attrs, options) {
            (options = options || {}).parse = true;
            this.items = new models.Values();
            models.Page.prototype.constructor.call(this, attrs, options);
        },

        parse: function(resp, options) {
            this.items.reset(resp.values, options);
            delete resp.values;
            return resp;
        }
    });


    // Paginator (collection) of pages which is driven by a field values
    // endpoint.
    var SearchPaginator = models.Paginator.extend({
        model: SearchPageModel,

        initialize: function(items, options) {
            options = options || {};
            this.field = options.field;
            this.currentUrl = null;
            models.Paginator.prototype.initialize.call(this, items, options);
        },

        url: function() {
            var url = this.currentUrl || this.field.links.values;

            if (this.urlParams) {
                url = url + '?' + $.param(this.urlParams);
            }
            return url;
        }
    });

    // Single search result item
    var SearchItem = Marionette.ItemView.extend({
        className: 'value-item',

        template: 'controls/search/item',

        ui: {
            actions: '.actions',
            addButton: '.add-item-button',
            removeButton: '.remove-item-button',
            label: '.value-label'
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
            if (this.ui.label.html() === '') {
                this.ui.label.html('(empty)');
            } else if (this.ui.label.html() === 'null') {
                this.ui.label.html('(null)');
            }
        }
    });


    // A single page of search results
    var SearchPage = paginator.ListingPage.extend({
        className: 'search-value-list',
        itemView: SearchItem
    });


    // All search result pages, only the current page is shown, the rest are
    // hidden.
    var SearchPageRoll = paginator.PageRoll.extend({
        listView: SearchPage
    });


    var SearchControl = controls.ControlLayout.extend({
        className: 'field-value-search',

        template: 'controls/search/layout',

        searchPaginator: SearchPaginator,

        events: {
            'click [data-action=clear]': 'clearValues'
        },

        regions: {
            search: '.search-region',
            paginator: '.paginator-region',
            browse: '.browse-region',
            values: '.values-region'
        },

        regionViews: {
            search: search.Search,
            paginator: paginator.Paginator,
            browse: SearchPageRoll,
            values: values.ValueList
        },

        initialize: function() {
            // Initialize a new collection of values for use by the
            // two regions. This is shared between the source data
            // and the selected values for toggling state changes.
            if (!this.collection) {
                this.collection = new models.Values();

                var _this = this;
                this.collection.url = function() {
                    return _this.model.links.values;
                };
            }

            // Trigger a change event on all collection events
            this.listenTo(this.collection, 'all', this.change);

            this.valuesPaginator = new this.searchPaginator(null, {
                field: this.model
            });

            this.valuesPaginator.refresh();
        },

        onRender: function() {
            var searchRegion = new this.regionViews.search({
                model: this.model,
                placeholder: 'Search ' + this.model.get('plural_name') + '...'
            });

            // Listen to search events
            this.listenTo(searchRegion, 'search', this.handleSearch);

            var browseRegion = new this.regionViews.browse({
                collection: this.valuesPaginator,
                values: this.collection
            });

            var paginatorRegion = new this.regionViews.paginator({
                className: 'paginator mini',
                model: this.valuesPaginator
            });

            var valuesRegion = new this.regionViews.values({
                collection: this.collection
            });

            this.search.show(searchRegion);
            this.browse.show(browseRegion);
            this.paginator.show(paginatorRegion);
            this.values.show(valuesRegion);
        },

        handleSearch: function(query) {
            this.valuesPaginator.urlParams = query ? {query: query} : null;
            this.valuesPaginator.refresh();
        },

        clearValues: function() {
            this.collection.reset();
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
            return this.collection.toJSON();
        },

        setValue: function(value) {
            // Do not merge into existing models since the collection contains
            // additional state (which would be removed due to the merge).
            this.collection.set(value, {merge: false});
        },

        validate: function(attrs) {
            // If a call is still pending, warn the user that they are too
            // fast for their own good and to try again in a bit.
            var pending = this.collection.any(function(value) {
                return value.get('pending') === true;
            });

            if (pending) {
                return 'The entered ' + this.model.get('plural_name') +
                       ' are being validated.';
            }

            // Get a list of labels for all the elements in the collection that
            // were found to be invalid during the last call to the values
            // endpoint on the server. If no such elements exist, then this
            // control is deemed valid.
            var invalid = [];

            this.collection.each(function(model) {
                if (model.get('valid') === false) {
                    invalid.push(model.get('label'));
                }
            });

            if (invalid.length) {
                return 'The following ' + this.model.get('plural_name') +
                       ' are invalid: <pre>' + invalid.join('\n') + '</pre>';
            }

            if (attrs && (!attrs.value || !attrs.value.length)) {
                return 'At least one value must be selected';
            }
        }

    });

    return {
        SearchControl: SearchControl,
        SearchItem: SearchItem,
        SearchPage: SearchPage,
        SearchPageRoll: SearchPageRoll,
        SearchPaginator: SearchPaginator
    };

});
