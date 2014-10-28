/* global define */

define([
    'underscore',
    'backbone',
    '../core'
], function(_, Backbone, c) {

    var PaginatorMixin = {
        comparator: 'page_num',

        refresh: function() {
            var url = _.result(this, 'url');

            if (this.pending) {
                // Request already being made, otherwise abort
                if (url === this.pending.url) return;

                if (this.pending.abort) {
                    this.pending.abort();
                }
            }

            var _this = this;

            this.pending = this.fetch({
                reset: true
            }).done(function() {
                delete _this.pending;
                _this.setCurrentPage(_this.models[0].id);
            });

            // This is a deferred and does not contain any of the
            // ajax settings, so we set the url for later reference.
            this.pending.url = url;
        },

        // Parses the initial fetch which is a single page, resets if necessary
        parse: function(resp, options) {
            if (!options.reset) {
                // TODO Smartly shuffle pages when only the size changes.
                // The data is not invalid, just broken up differently.
                this.reset(null, {
                    silent: true
                });
            }

            this.perPage = resp.per_page;   // jshint ignore:line
            this.trigger('change:pagesize', this, this.perPage);
            this.numPages = resp.num_pages; // jshint ignore:line
            this.trigger('change:pagecount', this, this.numPages);
            this.objectCount = resp.object_count;   // jshint ignore:line
            this.trigger('change:objectcount', this, this.objectCount);
            this.currentPageNum = null;
            this.setCurrentPage(resp.page_num); // jshint ignore:line

            return [resp];
        },

        // Ensures `num` is within the bounds
        hasPage: function(num) {
            return (1 <= num && num <= this.numPages);
        },

        // Checks the a _next_ page exists for num (or the current page)
        hasNextPage: function(num) {
            if (!num) num = this.currentPageNum;

            return num < this.numPages;
        },

        // Checks the a _previous_ page exists for num (or the current page)
        hasPreviousPage: function(num) {
            if (!num) num = this.currentPageNum;

            return num > 1;
        },

        // Set the current page which triggers the 'change:page' event
        setCurrentPage: function(num) {
            if (num === this.currentPageNum) return;

            if (!this.hasPage(num)) {
                throw new Error('Cannot set the current page out of bounds');
            }

            this.previousPageNum = this.currentPageNum;
            this.currentPageNum = num;

            var prefetch = c.config.get('prefetch');
            if (prefetch !== false && prefetch > 0) {
                for (var i = 1; i <= prefetch; i++) {
                    this.getPage(num - i, {active: false});
                    this.getPage(num + i, {active: false});
                }
            }

            return this.trigger.apply(this, ['change:currentpage', this].concat(
                [].slice.call(this.getCurrentPageStats())));
        },

        // Gets or fetches the page for num, if options.active is true
        // the page is set as the current one.
        // If the page does not already exist, the model is created, added
        // to the collected and fetched. Once fetched, the page is resolved.
        getPage: function(num, options) {
            if (!options) options = {};

            if (!this.hasPage(num)) return;

            var prefetch = c.config.get('prefetch');
            var model = this.get(num);

            // If the model is already resolved and we were prefetching then
            // trigger the add event since we were silencing it during the
            // initial fetch call. We only want to add the model once so we
            // check that is hasn't been added already.
            if (model && prefetch !== false && !model.pending && !model.added) {
                this.trigger('add', model);
                model.added = true;
            }
            if (!model && options.load !== false) {
                model = new this.model({
                    page_num: num       // jshint ignore:line
                });

                model.pending = true;
                this.add(model);

                var _this = this;
                var fetchOptions = {
                    silent: c.config.get('prefetch') !== false
                };
                model.fetch(fetchOptions).done(function() {
                    // If we are on this models page then we need to let
                    // everyone know this model is now available.
                    if (_this.currentPageNum === model.id &&
                            prefetch !== false) {
                        _this.trigger('add', model);
                        model.added = true;
                    }
                    delete model.pending;
                });
            }

            if (model && options.active !== false) {
                this.setCurrentPage(num);
            }

            return model;
        },

        getCurrentPage: function(options) {
            return this.getPage(this.currentPageNum, options);
        },

        getFirstPage: function(options) {
            return this.getPage(1, options);
        },

        getLastPage: function(options) {
            return this.getPage(this.numPages, options);
        },

        // Gets the next page relative to the current page
        getNextPage: function(num, options) {
            if (!num) num = this.currentPageNum;

            return this.getPage(num + 1, options);
        },

        // Gets the previous page relative to the current page
        getPreviousPage: function(num, options) {
            if (!num) num = this.currentPageNum;

            return this.getPage(num - 1, options);
        },

        // Checks if the current page is pending. Use of this check prevents
        // stampeding the server with requests if the current one has not
        // responded yet.
        pageIsLoading: function(num) {
            if (!num) num = this.currentPageNum;

            var page = this.getPage(num, {
                active: false,
                load: false
            });

            if (page) {
                return !!page.pending;
            }
        },

        getPageCount: function() {
            return this.numPages;
        },

        getCurrentPageStats: function() {
            return [
                this.currentPageNum, {
                    previous: this.previousPageNum,
                    first: this.currentPageNum === 1,
                    last: this.currentPageNum === this.numPages
                }
            ];
        }

    };

    // Provides the facility for fetching it's own clice of content based on
    // the collection it's contained in.
    var Page = Backbone.Model.extend({
        idAttribute: 'page_num',

        url: function() {
            var url = _.result(this.collection, 'url');
            return c.utils.alterUrlParams(url, {
                page: this.id,
                per_page: this.collection.perPage   // jshint ignore:line
            });
        }
    });

    // Paginator collection for managing its pages
    var Paginator = Backbone.Collection.extend({
        model: Page
    });

    _.extend(Paginator.prototype, PaginatorMixin);

    return {
        PaginatorMixin: PaginatorMixin,
        Page: Page,
        Paginator: Paginator
    };

});
