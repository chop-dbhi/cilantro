/* global define */

define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    './base',
    './search',
    '../search',
    '../values',
    '../paginator',
    '../../models',
], function($, _, Backbone, Marionette, controls, searchControl, search, values,
            paginator, models) {


    // Collection that listens to another collection for models that match
    // certain criteria. Models that match will be added/removed from
    // this collection.
    var FilteredCollection = Backbone.Collection.extend({
        _matches: function(model) {
            var attrs = model.attributes || model;
            return this.matcher(attrs);
        },

        initialize: function(models, options) {
            this.matcher = options.matcher;
            this.values = options.collection;

            this.listenTo(this.values, {
                change: function(model, options) {
                    if (this._matches(model)) {
                        this.add(model, options);
                    } else {
                        this.remove(model, options);
                    }
                },
                add: function(model, collection, options) {
                    if (this._matches(model)) this.add(model, options);
                },
                remove: function(model, collection, options) {
                    if (this._matches(model)) this.remove(model, options);
                },
                reset: function(models, collection, options) {
                    var _models = null;
                    if (!models || !models.length) {
                        _models = [];
                    } else {
                        _models = _.filter(models, this._matches);
                    }
                    if (_models) this.reset(_models, options);
                }
            });
        }
    });


    // Extend value model to ensure the default operator is defined
    var BucketValue = models.Value.extend({
        defaults: {
            operator: 'in'
        }
    });


    var BucketValues = models.Values.extend({
        model: BucketValue
    });


    // Single item in a bucket
    var BucketItem = values.ValueItem.extend({
        template: 'controls/vocab/bucket-item',

        ui: {
            remove: '[data-target=remove]'
        },

        events: {
            'click @ui.remove': 'removeItem'
        },

        removeItem: function() {
            this.model.destroy();
        }
    });


    // Buckets are implicitly bound to an operator via the passed collection.
    // The bucket name must be passed as an option.
    var Bucket = Marionette.CompositeView.extend({
        className: 'vocab-bucket',

        template: 'controls/vocab/bucket',

        itemView: BucketItem,

        itemViewContainer: '[data-target=items]',

        options: {
            name: 'Bucket'
        },

        ui: {
            items: '[data-target=items]'
        },

        events: {
            'sortreceive [data-target=items]': 'receiveItem'
        },

        collectionEvents: {
            'add remove reset': 'renderListState'
        },

        serializeData: function() {
            return {
                name: this.options.name
            };
        },

        // jQuery UI does not trigger an event on the item itself, only the
        // lists themselves. The `ui.item` is the bucket item DOM element
        // which can be used to find the collection item.
        receiveItem: function(event, ui) {
            // Find the model based on the value
            var value = ui.item.find('[data-value]').data('value'),
                model = this.collection.values.findWhere({value: parseInt(value, 10)});

            model.set('operator', this.options.operator);
        },

        onRender: function() {
            this.ui.items.sortable({
                forcePlaceholderSize: true,
                forceHelperSize: true,
                placeholder: 'placeholder',
                scroll: false,
                opacity: 0.7,
                cursor: 'move',
                connectWith: '.vocab-bucket [data-target=items]'
            });

            this.renderListState();
        },

        renderListState: function() {
            this.$el.toggleClass('empty', this.collection.length === 0);
        }

    });


    // View that initializes a filtered collection and renders a bucket for each
    // available operator.
    var BucketList = Marionette.View.extend({
        initialize: function() {
            var name = this.model.get('alt_name').toLowerCase(),
                pluralName = this.model.get('alt_plural_name').toLowerCase();

            this.buckets = [{
                name: 'At least one ' + name + ' must match',

                operator: 'in',

                collection: new FilteredCollection(null, {
                    collection: this.collection,
                    matcher: function(attrs) {
                        return attrs.operator === 'in';
                    }
                })
            }, {
                name: 'All the ' + pluralName + ' must match',

                operator: 'all',

                collection: new FilteredCollection(null, {
                    collection: this.collection,
                    matcher: function(attrs) {
                        return attrs.operator === 'all';
                    }
                })
            }, {
                name: 'The combination of '+ pluralName + ' cannot match',

                operator: '-all',

                collection: new FilteredCollection(null, {
                    collection: this.collection,
                    matcher: function(attrs) {
                        return attrs.operator === '-all';
                    }
                })
            }, {
                name: 'None of the ' + pluralName + ' can match',

                operator: '-in',

                collection: new FilteredCollection(null, {
                    collection: this.collection,
                    matcher: function(attrs) {
                        return attrs.operator === '-in';
                    }
                })
            }];
        },

        render: function() {
            for (var i = 0; i < this.buckets.length; i++) {
                var bucket = new Bucket(this.buckets[i]);
                bucket.render();
                this.$el.append(bucket.el);
            }
            return this.el;
        }
    });


    // Region displaying the current path and button for going up the stack
    var Path = Marionette.ItemView.extend({
        template: 'controls/vocab/path',

        className: 'vocab-path'
    });


    // Single search result item
    var VocabItem = Marionette.ItemView.extend({
        className: 'value-item',

        template: 'controls/vocab/item',

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

        serializeData: function() {
            var link = this.model.get('_links').children;

            return {
                url: link ? link.href : null,
                label: this.model.get('label')
            };
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
    var VocabPage = paginator.ListingPage.extend({
        className: 'search-value-list',

        itemView: VocabItem
    });


    // All search result pages, only the current page is shown, the rest are
    // hidden.
    var VocabPageRoll = paginator.PageRoll.extend({
        listView: VocabPage
    });


    var VocabControl = controls.ControlLayout.extend({
        className: 'vocab-control',

        template: 'controls/vocab/layout',

        events: {
            'click [data-action=clear]': 'clearValues',
            'click .browse-region a': 'triggerDescend',
            'click .path-region button': 'triggerAscend'
        },

        options: {
            resetPathOnSearch: false
        },

        regions: {
            paginator: '.paginator-region',
            search: '.search-region',
            path: '.path-region',
            browse: '.browse-region',
            buckets: '.buckets-region'
        },

        regionViews: {
            search: search.Search,
            paginator: paginator.Paginator,
            path: Path,
            browse: VocabPageRoll,
            buckets: BucketList
        },

        initialize: function() {
            // Initialize a new collection of values that centralizes the
            // selected values.
            this.selectedValues = new BucketValues();

            // Trigger a change event on all collection events
            this.listenTo(this.selectedValues, 'all', this.change);

            this.valuesPaginator = new searchControl.SearchPaginator(null, {
                field: this.model
            });

            this._path = new Backbone.Collection();
        },

        triggerDescend: function(event) {
            event.preventDefault();
            event.stopPropagation();

            var target = $(event.target);

            // Push item onto the stack; triggers refresh downstream
            this._path.push({
                label: target.text(),
                url: target.prop('href')
            });
        },

        triggerAscend: function() {
            event.preventDefault();
            event.stopPropagation();

            // Popitem off stack; triggers refresh downstream
            this._path.pop();
        },

        refreshPaginator: function() {
            var model = this._path.last();

            this.path.show(new this.regionViews.path({
                model: model
            }));

            this.valuesPaginator.currentUrl = model.get('url');
            this.valuesPaginator.refresh();
        },

        onRender: function() {
            // When a search occurs, the paginator is reset to use the
            // URL with the parameters. When the search is cleared, the
            // default URL is used (accessing the root).
            var searchRegion = new this.regionViews.search({
                model: this.model,
                placeholder: 'Search ' + this.model.get('plural_name') + '...',
            });

            this.listenTo(searchRegion, 'search', this.handleSearch);

            // Click events from valid path links in the browse region
            // will cause the paginator to refresh
            var browseRegion = new this.regionViews.browse({
                collection: this.valuesPaginator,
                values: this.selectedValues
            });

            var paginatorRegion = new this.regionViews.paginator({
                className: 'paginator mini',
                model: this.valuesPaginator
            });

            var bucketsRegion = new this.regionViews.buckets({
                model: this.model,
                collection: this.selectedValues
            });

            this.search.show(searchRegion);
            this.browse.show(browseRegion);
            this.paginator.show(paginatorRegion);
            this.buckets.show(bucketsRegion);

            this.listenTo(this._path, 'add remove', this.refreshPaginator);

            // Add top-level (default) which will render
            this._path.push({label: 'Top-level'});
        },

        handleSearch: function(query) {
            if (this.options.resetPathOnSearch) {
                this.valuesPaginator.currentUrl = null;
            }

            this.valuesPaginator.urlParams = query ? {query: query} : null;
            this.valuesPaginator.refresh();
        },

        get: function() {
            // Object of operator keys and array values
            var operator, values = {};

            // Build operator/values map
            this.selectedValues.each(function(model) {
                operator = model.get('operator');

                // Initialize the array if this is the first value
                // for this operator
                if (!values[operator]) values[operator] = [];

                values[operator].push(model.pick('label', 'value'));
            });

            var operators = _.keys(values);

            // No values selected
            if (!operators.length) return;

            // Single operator, return single condition
            if (operators.length === 1) {
                return {
                    field: this.model.id,
                    operator: operators[0],
                    value: values[operators[0]]
                };
            }

            // Multiple operators, return branch of conditions
            return {
                type: 'and',
                children: _.map(values, function(values, operator) {
                    return {
                        field: this.model.id,
                        operator: operator,
                        value: values
                    };
                }, this)
            };
        },

        _mapSetValues: function(values, operator) {
            return _.map(values, function(value) {
                // Value is expected to be an object with label and value keys.
                value = _.clone(value);
                value.operator = operator;
                return value;
            });
        },

        // The expected structure is either null, a single condition or
        // a branch of one or more conditions. Values are collected and
        // tagged with the operator that is applied to the values.
        set: function(attrs) {
            if (!attrs) return;

            var values = [];

            if (attrs.children) {
                // Each child is a condition with an array of values
                _.each(attrs.children, function(child) {
                    values = values.concat(this._mapSetValues(child.value,
                                                              child.operator));
                }, this);
            } else {
                values = this._mapSetValues(attrs.value, attrs.operator);
            }

            // Do not remove values in case they are new since the set
            // has occurred.
            this.selectedValues.set(values, {remove: false});
        }

    });

    return {
        VocabControl: VocabControl
    };

});
