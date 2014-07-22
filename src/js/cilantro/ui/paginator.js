/* global define */

define([
    'jquery',
    'underscore',
    'marionette',
    './base',
    '../constants'
], function($, _, Marionette, base, constants) {

    var EmptyPage = base.EmptyView.extend({
        message: 'No page results'
    });

    var LoadingPage = base.LoadView.extend({
        message: 'Loading page...'
    });

    // Set of pagination links that are used to control/navigation the bound
    // model. The model is assumed to implement the 'paginator protocol', see
    // cilantro/models/paginator.
    var Paginator = Marionette.ItemView.extend({
        template: 'paginator',

        className: 'paginator',

        ui: {
            first: '[data-page=first]',
            prev: '[data-page=prev]',
            next: '[data-page=next]',
            last: '[data-page=last]',
            pageCount: '.page-count',
            currentPage: '.current-page',
            buttons: '[data-toggle=tooltip]'
        },

        modelEvents: {
            'change:pagecount': 'renderPageCount',
            'change:currentpage': 'renderCurrentPage'
        },

        events: {
            'click [data-page]': 'requestChangePage'
        },

        initialize: function() {
            this._changePage = _.debounce(this.changePage, constants.REQUEST_DELAY);
        },

        onRender: function() {
            // The tooltip call MUST be done before the render calls below or
            // the tooltip options set here will not be respected because some
            // of the buttons will be disabled.
            this.ui.buttons.tooltip({
                animation: false,
                placement: 'bottom'
            });

            if (!this.model.pageIsLoading()) {
                this.renderPageCount(this.model, this.model.getPageCount());
                var args = [this.model].concat(this.model.getCurrentPageStats());
                this.renderCurrentPage.apply(this, args);
            }
        },

        renderPageCount: function(model, value) {
            this.ui.pageCount.text(value);
        },

        renderCurrentPage: function(model, value, options) {
            this.ui.currentPage.text(value);
            this.ui.first.prop('disabled', !!options.first);
            this.ui.prev.prop('disabled', !!options.first);
            this.ui.next.prop('disabled', !!options.last);
            this.ui.last.prop('disabled', !!options.last);

            // If we have disabled the buttons then we need to force hide the
            // tooltip to prevent it from being permanently visible.
            if (!!options.first) {
                this.ui.first.tooltip('hide');
                this.ui.prev.tooltip('hide');
            }

            if (!!options.last) {
                this.ui.next.tooltip('hide');
                this.ui.last.tooltip('hide');
            }
        },

        changePage: function(newPage) {
            switch (newPage) {
                case 'first':
                    return this.model.getFirstPage();
                case 'prev':
                    return this.model.getPreviousPage();
                case 'next':
                    return this.model.getNextPage();
                case 'last':
                    return this.model.getLastPage();
                default:
                    throw new Error('Unknown paginator direction: ' + newPage);
            }
        },

        requestChangePage: function(event) {
            this._changePage($(event.currentTarget).data('page'));
        }
    });

    // Page for representing model-based data.
    var Page = Marionette.ItemView.extend({});

    // Page for representing collection-based data.
    var ListingPage = Marionette.CollectionView.extend({
        itemView: Page,

        emptyPage: EmptyPage,

        itemViewOptions: function(item, index) {
            return _.defaults({model: item, index: index}, this.options);
        }
    });

    // Renders multiples pages as requested, but only shows the current
    // page. This is delegated by the paginator-based collection bound to
    // this view.
    //
    // The contained views may be model-based or collection-based. This is
    // toggled based on the `options.list` flag. If true, the `listView`
    // will be used as the item view class. Otherwise the standard `itemView`
    // will be used for model-based data.
    //
    // If list is true, the `listViewOptions` will be called to produce the
    // view options for the collection view. By default the item passed in
    // is assumed to have an `items` collection on it that will be used.
    var PageRoll = Marionette.CollectionView.extend({
        options: {
            list: true
        },

        itemView: Page,

        listView: ListingPage,

        // The first page is guaranteed (assumed) to be fetch and rendered,
        // thus the empty view for the page roll is the loading state.
        emptyView: LoadingPage,

        collectionEvents: {
            'change:currentpage': 'showCurrentPage'
        },

        // Toggle between list-based versus item-based page roll
        getItemView: function() {
            if (this.options.list) {
                return this.listView;
            }

            return this.itemView;
        },

        listViewOptions: function(item) {
            return {
                collection: item.items
            };
        },

        itemViewOptions: function(item, index) {
            var options = {
                model: item,
                index: index
            };

            if (this.options.list) {
                _.extend(options, this.listViewOptions(item, index));
            }

            return _.defaults(options, this.options);
        },

        showCurrentPage: function(model, num) {
            this.children.each(function(view) {
                view.$el.toggle(view.model.id === num);
            });
        }
    });

    return {
        Paginator: Paginator,
        Page: Page,
        ListingPage: ListingPage,
        PageRoll: PageRoll
    };
});
