/* global define */

define([
    'jquery',
    'underscore',
    'marionette',
    './base',
    './search',
    '../utils'
], function($, _, Marionette, base, search, utils) {

    var elementScrollPosition = function(child) {
        var total = 0;

        child.prevAll().each(function(i, sib) {
            total += $(sib).outerHeight(true);
        });

        return total;
    };


    var elementAtScrollPosition = function(parent, options) {

        options = _.extend({
            threshold: 0.25
        }, options);

        // Current scroll position and total scroll height
        var scrollTop = parent[0].scrollTop,
            scrollHeight = parent[0].scrollHeight;

        // Determine element that makes the dominant view of the scroll window.
        // If the top-most element is partially out of view, the following element
        // will be marked if they it has more pixels visible.
        var i,
            child,
            sibling,
            previous,
            childHeight,
            childVisibleHeight,
            childVisiblePercentage,
            totalChildHeight = 0;

        var children = parent.children();

        for (i = 0; i < children.length; i++) {
            child = $(children[i]);
            childHeight = child.outerHeight(true);
            childVisiblePercentage = 1;

            totalChildHeight += childHeight;

            // Scroll is completely beyond child
            if (scrollTop > totalChildHeight) continue;

            // Check a sibling exists
            if (!children[i + 1]) break;

            sibling = $(children[i + 1]);

            // Calculate the visible height of the child
            childVisibleHeight = totalChildHeight - scrollTop;
            childVisiblePercentage = childVisibleHeight / childHeight;

            // If at least N % is visible, use it
            if (childVisiblePercentage < options.threshold) {
                previous = child;
                child = sibling;
                i++;
            }

            break;
        }

        return {
            parent: parent,
            position: scrollTop,
            percentage: scrollTop / scrollHeight,
            visibility: childVisiblePercentage,
            previous: previous,
            index: i,
            element: child
        };
    };


    var PaginationSearch = search.Search.extend({
        initialize: function() {
            // Store initial collection URL, so it can be reverted to
            // when a query is not present
            this.initialUrl = _.result(this.collection, 'url');
        },

        search: function(query) {
            var url = this.initialUrl;

            if (query) url = utils.alterUrlParams(url, {query: query});

            this.collection.url = function() {
                return url;
            };

            this.collection.fetch({reset: true});
        }
    });


    var PaginatedItems = Marionette.CollectionView.extend({
        options: {
            // Pixels from the bottom that triggers the next page load
            scrollThreshold: 100,
            height: 200
        },

        events: {
            'scroll': 'handleScroll',
        },

        emptyView: base.EmptyView,

        collectionEvents: {
            'page:loading': 'handlePageLoading',
            'page:loaded': 'handlePageLoaded',
            'page:change': 'handlePageChange'
        },

        onRender: function() {
            var css = {overflow: 'auto'};
            if (this.options.height) css.height = this.options.height;
            this.$el.css(css);
        },

        // Returns a boolean denoting if the scroll threshold has been exceeded
        scrollThresholdExceeded: function() {
            // Check if the scroll position has passed the threshold
            var remainingScroll = this.el.scrollHeight -
                                  this.el.scrollTop -
                                  this.$el.height();

            return remainingScroll <= this.options.scrollThreshold;
        },

        // It must "get" current page relative to the scroll position or
        // fetch the next page once the
        handleScroll: function() {
            // Currently animating (i.e. auto-scrolling)
            if (this.$el.is(':animated')) return;

            // Empty, nothing to scroll to
            if (!this.collection.length) return;

            // Get the element at the current scroll position,
            // determine which page it is part of
            var item = elementAtScrollPosition(this.$el);

            var pageId = Math.floor(item.index / this.collection.getPageSize()) + 1;
            this.collection.getPage(pageId, {scroll: false});

            // Scroll threshold disabled
            if (!this.options.scrollThreshold) return;

            if (this.scrollThresholdExceeded()) {
                this.collection.getNextPage({
                    wait: true,
                    silent: true,
                    scroll: false
                });
            }
        },

        scrollToPage: function(model) {
            // Stop animations, clear the queue
            this.$el.stop(true);

            var index = model.getStartIndex(),
                item = this.collection.findWhere({index: index}),
                view = this.children.findByModel(item),
                scrollTop = elementScrollPosition(view.$el);

            this.$el.animate({scrollTop: scrollTop});
        },

        handlePageChange: function(model, collection, options) {
            options = options || {};

            // Internal option to prevent invoking the scroll. If a
            // page change is invoked externally, this will fire.
            if (collection.length > 1 && options.scroll !== false) {
                this.scrollToPage(model);
            }
        },

        handlePageLoading: function(model) {
            if (this.loadingView) return;
            this.loadingView = new base.LoadView({
                message: 'Loading page ' + model.getPageNum() + '...'
            });

            // Delay showing the loading view to prevent flickering for very
            // responsive page loads
            var _this = this;
            this._loadingViewTimeout = _.delay(function() {
                _this.loadingView.render();
                _this.$el.append(_this.loadingView.el);
            }, 100);
        },

        handlePageLoaded: function() {
            if (!this.loadingView) return;
            clearTimeout(this._loadingViewTimeout);
            this.loadingView.remove();
            this.loadingView = null;
        }

    });


    // Set of pagination links that are used to control/navigation the bound
    // model. This relies on a pagination.PaginatedCollection instance.
    var PaginationToolbar = Marionette.ItemView.extend({
        className: 'paginator',

        template: 'paginator/toolbar',

        ui: {
            first: '[data-page=first]',
            prev: '[data-page=prev]',
            next: '[data-page=next]',
            last: '[data-page=last]',
            pageCount: '.page-count',
            currentPage: '.current-page',
            buttons: '[data-toggle=tooltip]'
        },

        collectionEvents: {
            'page:change': 'renderPage'
        },

        events: {
            'click [data-page=first]': 'triggerPageChange',
            'click [data-page=prev]': 'triggerPageChange',
            'click [data-page=next]': 'triggerPageChange',
            'click [data-page=last]': 'triggerPageChange'
        },

        onRender: function() {
            // The tooltip call MUST be done before the render calls below or
            // the tooltip options set here will not be respected because some
            // of the buttons will be disabled.
            this.ui.buttons.tooltip({animation: false, placement: 'bottom'});
            this.renderPage(this.collection.getCurrentPage());
        },

        renderPage: function(model) {
            this.ui.pageCount.text(model.getNumPages());
            this.ui.currentPage.text(model.getPageNum());

            var hasNext = model.hasNextPage(),
                hasPrev = model.hasPreviousPage();

            this.ui.first.prop('disabled', !hasPrev);
            this.ui.prev.prop('disabled', !hasPrev);
            this.ui.next.prop('disabled', !hasNext);
            this.ui.last.prop('disabled', !hasNext);

            // If we have disabled the buttons then we need to force hide the
            // tooltip to prevent it from being permanently visible
            this.ui.first.tooltip('show' ? hasPrev : 'hide');
            this.ui.prev.tooltip('show' ? hasPrev : 'hide');

            this.ui.next.tooltip('show' ? hasNext : 'hide');
            this.ui.last.tooltip('show' ? hasNext : 'hide');
        },

        changePage: function(page, options) {
            switch (page) {
            case 'first':
                this.collection.getFirstPage(options);
                break;
            case 'prev':
                this.collection.getPreviousPage(options);
                break;
            case 'next':
                this.collection.getNextPage(options);
                break;
            case 'last':
                this.collection.getLastPage(options);
                break;
            default:
                throw new Error('Unknown paginator direction: ' + page);
            }
        },

        triggerPageChange: function(event) {
            event.preventDefault();
            this.changePage($(event.currentTarget).data('page'), {wait: true});
        }

    });


    return {
        PaginatedItems: PaginatedItems,
        PaginationToolbar: PaginationToolbar,
        PaginationSearch: PaginationSearch
    };

});
