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
], function($, _, Marionette, base, models, constants, paginator, values, search) {

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
            models.Paginator.prototype.initialize.call(this, items, options);
        },

        url: function() {
            var url = this.field.links.values;
            if (this.urlParams) {
                url = url + '?' + $.param(this.urlParams);
            }
            return url;
        }
    });


    // View for querying field values
    var ValueSearch = search.Search.extend({
        className: 'field-search search',

        initialize: function() {
            search.Search.prototype.initialize.call(this);
            this.paginator = this.options.paginator;
        },

        search: function(query) {
            if (query) {
                this.options.paginator.urlParams = {query: query};
            } else {
                this.paginator.urlParams = null;
            }

            this.paginator.refresh();
        }
    });


    // Single search result item
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


    var SearchControl = base.ControlLayout.extend({
        className: 'field-value-search',

        template: 'controls/search/layout',

        searchPaginator: SearchPaginator,

        regions: {
            search: '.search-region',
            paginator: '.paginator-region',
            browse: '.browse-region',
            values: '.values-region'
        },

        regionViews: {
            search: ValueSearch,
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
                paginator: this.valuesPaginator,
                placeholder: 'Search ' + this.model.get('plural_name') + '...'
            });

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

        validate: function() {
            var pending, invalid = [];

            // If a call is still pending, warn the user that they are too
            // fast for their own good and to try again in a bit.
            pending = this.collection.any(function(value) {
                return value.get('pending') === true;
            });

            if (pending) {
                return 'The values are being checked, please wait a few ' +
                       'seconds then click &quot;Apply Filter&quot; again.';
            }

            // Get a list of labels for all the elements in the collection that
            // were found to be invalid during the last call to the values
            // endpoint on the server. If no such elements exist, then this
            // control is deemed valid.
            this.collection.each(function(value) {
                if (!value.get('valid')) {
                    invalid.push(value.get('label'));
                }
            });

            if (invalid.length) {
                return 'Remove the following invalid labels then click ' +
                       '&quot;Apply Filter&quot; again: ' + invalid.join(', ');
            }
        }

    });

    return {
        SearchControl: SearchControl,
        ValueSearch: ValueSearch,
        SearchItem: SearchItem,
        SearchPage: SearchPage,
        SearchPageRoll: SearchPageRoll,
        SearchPaginator: SearchPaginator
    };

});
