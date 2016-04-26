/* global define */

define([
    'jquery',
    'underscore',
    'marionette',
    '../core',
    '../paginator',
    '../numbers',
    '../tables'
], function($, _, Marionette, c, paginator, numbers, tables) {


    var ResultCount = Marionette.ItemView.extend({
        tagName: 'span',

        className: 'result-count',

        template: 'count',

        ui: {
            count: '.count',
            label: '.count-label'
        },

        initialize: function() {
            this.model.stats.on('sync', this.updateCount, this);
            this.on('render', this.updateCount, this);
        },

        updateCount: function() {
            var count = this.model.stats.get('count');
            this.collection.setResultCount(count);
            numbers.renderCount(
                this.ui.count,
                count,
                'all'
            );
            this.ui.label.text('records');
        }
    });


    var ResultsPaginator = paginator.Paginator.extend({
        renderPageCount: function(model, value) {
            var text = value;

            // If the page count is undefined then we don't know how many
            // pages there are so we can just claim to be showing all pages
            // for now until we get an actual value.
            if (value === undefined) text = 'all';

            // If there are no pages, just lie and claim there is a single page
            // since the current page will be 1 in this case and showing page
            // 1 / 0 would be a little confusing to the user.
            if (value === 0) text = 1;

            this.ui.pageCount.text(text);
        },

        renderCurrentPage: function(model, value, options) {
            this.ui.currentPage.text(value);
            this.ui.first.prop('disabled', !!options.first);
            this.ui.prev.prop('disabled', !!options.first);
            this.ui.next.prop('disabled', !!options.next);
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
        }
    });


    /*
     * The ResultsWorkflow provides an interface for previewing tabular data,
     * mechanisms for customizing the view, and a method for exporting data
     * to alternate formats.
     *
     * This view requires the following options:
     *      - view: the session/active view model
     *      - results: a Results collection that contains the tabular data
     */
    var ResultsWorkflow = Marionette.Layout.extend({
        className: 'results-workflow',

        template: 'workflows/results',

        ui: {
            toggleFiltersButton: '[data-toggle=context-panel]',
            toggleFiltersIcon: '[data-toggle=context-panel] i',
            toggleFiltersText: '[data-toggle=context-panel] span',
            navbar: '.results-workflow-navbar',
            resultsContainer: '.results-container',
            navbarButtons: '.results-workflow-navbar button',
            loadingOverlay: '[data-target=results-loading-message]',
            canceledQueryMessage: '[data-target=canceled-query-message]'
        },

        events: {
            'click [data-toggle=columns-dialog]': 'showColumnsDialog',
            'click [data-toggle=exporter-dialog]': 'showExporterDialog',
            'click [data-toggle=query-dialog]': 'showQueryDialog',
            'click [data-toggle=api-script-dialog]': 'showApiScriptDialog',
            'click [data-toggle=context-panel]': 'toggleContextPanel',
            'click [data-action=cancel-query]': 'handleCancelQuery',
            'click [data-action=retry-query]': 'handleRetryQuery'
        },

        regions: {
            count: '.count-region',
            table: '.table-region',
            paginator: '.paginator-region'
        },

        initialize: function() {
            // Bind for use as event handlers
            _.bindAll(this, 'onPageScroll');

            this.data = {};

            if (!(this.data.context = this.options.context)) {
                throw new Error('context model required');
            }

            if (!(this.data.view = this.options.view)) {
                throw new Error('view model required');
            }

            if (!(this.data.results = this.options.results)) {
                throw new Error('results collection required');
            }

            this.listenTo(this.data.results, 'request', this.showLoadingOverlay);
            this.listenTo(this.data.results, 'sync', this.hideLoadingOverlay);

            this.on('router:load', this.onRouterLoad);
            this.on('router:unload', this.onRouterUnload);
        },

        onRouterLoad: function() {
            this.data.results.trigger('workspace:load');
            this.hideContextPanel();
        },

        onRouterUnload: function() {
            this.data.results.trigger('workspace:unload');
        },

        handleCancelQuery: function(event) {
            event.preventDefault();
            this.data.results.cancel();
            this.showCanceledQueryMessage();
        },

        handleRetryQuery: function(event) {
            event.preventDefault();
            // Hideous..
            this.data.results.markAsDirty();
            this.data.results.fetch();
        },

        showCanceledQueryMessage: function() {
            this.hideLoadingOverlay();
            this.ui.canceledQueryMessage.show();
            this.table.$el.hide();
        },

        hideCanceledQueryMessage: function() {
            this.ui.canceledQueryMessage.hide();
            this.table.$el.show();
        },

        showLoadingOverlay: function() {
            if (this.isClosed !== true) {
                this.hideCanceledQueryMessage();
                this.ui.loadingOverlay.show();
            }
        },

        hideLoadingOverlay: function() {
            if (this.isClosed !== true) {
                this.ui.loadingOverlay.hide();
            }
        },

        toggleContextPanel: function() {
            if (c.panels.context.isPanelClosed()) {
                this.showContextPanel();
            }
            else {
                this.hideContextPanel();
            }
        },

        showContextPanel: function() {
            c.panels.context.openPanel();
            this.$el.addClass('panel-open');

            // If we don't update the title by calling fixTitle the tooltip
            // will not respect the attribute change. Also, if we are changing
            // the visibility of the context panel just go ahead and hide the
            // tooltip in case the cause of this was a user click in which case
            // the show/hide filter button is no longer under their mouse.
            this.ui.toggleFiltersButton.tooltip('hide')
                .attr('data-original-title', 'Hide Filter Panel')
                .tooltip('fixTitle');

            this.ui.toggleFiltersIcon.removeClass('icon-collapse-alt');
            this.ui.toggleFiltersIcon.addClass('icon-expand-alt');
            this.ui.toggleFiltersText.html('Hide Filters');
        },

        hideContextPanel: function() {
            c.panels.context.closePanel({full: true});
            this.$el.removeClass('panel-open');

            // If we don't update the title by calling fixTitle the tooltip
            // will not respect the attribute change. Also, if we are changing
            // the visibility of the context panel just go ahead and hide the
            // tooltip in case the cause of this was a user click in which case
            // the show/hide filter button is no longer under their mouse.
            this.ui.toggleFiltersButton.tooltip('hide')
                .attr('data-original-title', 'Show Filter Panel')
                .tooltip('fixTitle');

            this.ui.toggleFiltersIcon.addClass('icon-collapse-alt');
            this.ui.toggleFiltersIcon.removeClass('icon-expand-alt');
            this.ui.toggleFiltersText.html('Show Filters');
        },

        onPageScroll: function() {
            var scrollPos = $(document).scrollTop();

            // Record the vertical offset of the masthead nav bar if we
            // haven't done so already. This is used in scroll calculations.
            if (this.navbarVerticalOffset === undefined) {
                this.navbarVerticalOffset = this.ui.navbar.offset().top;
            }

            // If there is already something fixed to the top, record the
            // height of it so we can account for it in our scroll
            // calculations later.
            if (this.topNavbarHeight === undefined) {
                var topElement = $('.navbar-fixed-top');
                if (topElement.length > 0) {
                    this.topNavbarHeight = topElement.height();
                }
                else {
                    this.topNavbarHeight = 0;
                }
            }

            if (this.ui.navbar.hasClass('navbar-fixed-top')) {
                if (scrollPos < (this.navbarVerticalOffset - this.topNavbarHeight)) {
                    // Remove the results navbar from the top.
                    this.ui.navbar.removeClass('navbar-fixed-top');
                }
            }
            else {
                if (scrollPos >= (this.navbarVerticalOffset - this.topNavbarHeight)) {
                    // Move the results navbar to the top.
                    this.ui.navbar.css('top', this.topNavbarHeight);
                    this.ui.navbar.addClass('navbar-fixed-top');
                }
            }
        },

        onRender: function() {
            $(document).on('scroll', this.onPageScroll);

            this.paginator.show(new ResultsPaginator({
                model: this.data.results
            }));

            this.count.show(new ResultCount({
                model: this.data.context,
                collection: this.data.results
            }));

            this.table.show(new tables.Table({
                view: this.data.view,
                collection: this.data.results
            }));

            this.ui.navbarButtons.tooltip({
                animation: false,
                placement: 'bottom'
            });

            /*
            * If the user's view is empty, show them a notification explaining why no data
            * is being displayed. The notification is not shown when the
            * 'session.defaults.data.preview' config option is present. When that option
            * is being used, the view is overridden when making requests to the preview
            * endpoint so the data(order aside) shown in the results table will not be
            * affected by the columns(or lack thereof) the user has chosen.
            */
            this.listenTo(this.data.view.facets, 'reset', function() {
                if (this.data.view.facets.length === 0 &&
                        !c.config.get('session.defaults.data.preview')) {
                    c.notify({
                        header: 'No Columns Selected: ',
                        level: 'warning',
                        timeout: false,
                        message: 'No data can be displayed. Click the "Change ' +
                                 'Columns" button on the toolbar to select ' +
                                 'columns to display.'
                    });
                }
            });
        },

        onClose: function() {
            $(document).off('scroll', this.onPageScroll);
        },

        showExporterDialog: function() {
            c.dialogs.exporter.open();
        },

        showColumnsDialog: function() {
            c.dialogs.columns.open();
        },

        showQueryDialog: function() {
            // Opens the query modal without passing a model which assumes a
            // new one will be created based on the current session.
            c.dialogs.query.open();
        },

        showApiScriptDialog: function() {
          c.dialogs.apiScript.open();
        }
    });

    return {
        ResultCount: ResultCount,
        ResultsWorkflow: ResultsWorkflow
    };
});
