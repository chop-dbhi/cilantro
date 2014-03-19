/* global define */

define([
    'underscore',
    'backbone',
    '../utils'
], function(_, Backbone, utils) {

    var Page = Backbone.Model.extend({
        idAttribute: 'page_num',

        url: function() {
            var url = _.result(this.collection, 'url');
            return utils.alterUrlParams(url, {page: this.id});
        },

        initialize: function() {
            this._loading = false;

            this.once('request', function() {
                this._loading = true;
            });

            this.once('sync error', function() {
                this._loading = false;
            });
        },

        // Normalize the array containing the items
        parse: function(resp) {
            if (resp.values) {
                resp.items = resp.values;
                delete resp.values;
            } else if (resp.objects) {
                resp.items = resp.objects;
                delete resp.objects;
            } else if (!resp.items) {
                throw new Error('unknown items attribute');
            }

            // Add index relative to total count
            var offset = this.getPageNum() === 1 ? 0 : this.getStartIndex();

            _.each(resp.items, function(attrs, i) {
                attrs.index = offset + i;
            });

            return resp;
        },

        isLoading: function() {
            return !!this._loading;
        },

        getPageNum: function() {
            return this.get('page_num');
        },

        getStartIndex: function() {
            return (this.getPageNum() - 1) * this.getPageSize();
        },

        getEndIndex: function() {
            return this.getStartIndex() + this.get('items').length - 1;
        },

        hasNextPage: function() {
            return this.get('page_num') < this.get('num_pages');
        },

        hasPreviousPage: function() {
            return this.get('page_num') > 1;
        },

        getNumPages: function() {
            return this.get('num_pages');
        },

        getPageSize: function() {
            return this.get('limit');
        },

        getTotalCount: function() {
            return this.get('count');
        }

    });

    // Collection that loads items from a paginated resource.
    // The initial fetch will load the first page. Subsequent pages
    // can be fetched by
    var PaginatedCollection = Backbone.Collection.extend({
        pageModel: Page,

        constructor: function(models, options) {
            if (models) {
                throw new Error('paginated collections cannot be ' +
                                'initialized with existing models');
            }

            // Number of the last fetched page for relative lookups.
            this._currentPage = null;

            // Internal collection of fetched pages. As pages are fetched,
            // items are added to this collection to represent the overall
            // set of fetched items.
            var _this = this;

            this._pages = new Backbone.Collection(null, {
                model: this.pageModel
            });

            this._pages.url = function() {
                return _.result(_this, 'url');
            };

            Backbone.Collection.prototype.constructor.call(this, null, options);

            this.options = _.extend({}, this.options, options);
        },

        fetch: function(options) {
            options = options || {};
            var num;

            if (options.reset) {
                num = 1;
                this._pages.reset();
            } else {
                num = this._currentPage ? this._currentPage + 1 : 1;
            }
            this.getPage(num, options);
        },

        reset: function(models, options) {
            if (models) {
                throw new Error('paginated collections cannot be ' +
                                'reset with existing models');
            }
            Backbone.Collection.prototype.reset.call(this, null, options);
        },

        getNumPages: function() {
            var model;
            if (!(model = this.getCurrentPage())) return;
            return model.getNumPages();
        },

        getPageSize: function() {
            var model;
            if (!(model = this.getCurrentPage())) return;
            return model.getPageSize();
        },

        getTotalCount: function() {
            var model;
            if (!(model = this.getCurrentPage())) return;
            return model.getTotalCount();
        },

        getPage: function(num, options) {
            if (!num || num < 1 || parseFloat(num) !== parseInt(num, 10)) {
                throw new Error('page number be an integer greater than 0');
            }

            var model;

            // Ensure this is an integer since 1.0 === 1 is true..
            num = parseInt(num, 10);
            options = options || {};

            // Prevent getting another page if the current page is already
            // loading.
            if (options.wait) {
                model = this._pages.get(this._currentPage);
                if (model && model.isLoading()) return;
            }

            if ((model = this._pages.get(num))) {
                if (!options.silent) {
                    this._currentPage = num;
                    this.trigger('page:change', model, this, options);
                }
                return model;
            }

            // Manually initialize and setup new model so it can be immediately
            // returned. All collection-level attributes are provides so they can
            // immediately used
            model = new this._pages.model({
                page_num: num,
                num_pages: this.getNumPages(),
                limit: this.getPageSize(),
                count: this.getTotalCount()
            });

            // Add to the collection for reference and to make use of
            // the URL
            this._pages.add(model);

            // When the model is synced, add the page items to this
            // collection
            this.listenToOnce(model, 'sync', function(model) {
                // No longer part of the collection, ignore. cid is used
                // to uniquely identifier instances rather than page numbers
                if (!this._pages.get(model.cid)) return;

                if (options.reset) {
                    this.reset();
                }

                // Insert the items of this page at the specified index
                this.add(model.get('items'), {
                    at: model.getStartIndex()
                });

                this.trigger('page:loaded', model, this, options);

                if (!options.silent) {
                    this.trigger('page:change', model, this, options);
                }
            });

            this.listenToOnce(model, 'error', function(model) {
                this.trigger('page:error', model, this, options);
            });

            this.trigger('page:loading', model, this, options);

            model.fetch();

            // Implies a background fetch and does not change the state
            if (!options.silent) this._currentPage = num;

            return model;
        },

        getCurrentPage: function() {
            return this._pages.get(this._currentPage);
        },

        getNextPage: function(options) {
            var numPages = this.getNumPages();
            if (!this._currentPage || this._currentPage === numPages) return;
            return this.getPage(this._currentPage + 1, options);
        },

        getPreviousPage: function(options) {
            if (!this._currentPage || this._currentPage <= 1) return;
            return this.getPage(this._currentPage - 1, options);
        },

        getFirstPage: function(options) {
            return this.getPage(1, options);
        },

        getLastPage: function(options) {
            if (!this._currentPage) return;
            return this.getPage(this.getNumPages(), options);
        },

        hasLoadedPage: function(num) {
            return this._pages.get(num) !== undefined;
        }
    });

    return {
        Page: Page,
        PaginatedCollection: PaginatedCollection
    };

});
