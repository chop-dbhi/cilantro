/* global define */

define([
    'jquery',
    'underscore',
    'marionette',
    '../core',
    '../paginator',
    '../numbers',
    '../tables',
    '../context',
    '../exporter',
    '../query'
], function($, _, Marionette, c, paginator, numbers, tables, context, exporter, query) {

    var ResultCount = Marionette.ItemView.extend({
        tagName: 'span',

        className: 'result-count',

        template: 'count',

        ui: {
            count: '.count',
            label: '.count-label'
        },

        modelEvents: {
            'change:objectcount': 'renderCount'
        },

        onRender: function() {
            if (this.model.objectCount !== undefined) {
                this.renderCount(this.model, this.model.objectCount);
            }
            else {
                this.renderCount(this.model, '');
            }
        },

        renderCount: function(model, count, options) {
            numbers.renderCount(this.ui.count, count);
            this.ui.label.text('records');
        }
    });

    /*
     * The ResultsWorkflow provides an interface for previewing tabular data,
     * mechanisms for customizing the view, and a method for exporting data
     * to alternate formats.
     *
     * This view requires the following options:
     *      - context: the session/active context model
     *      - view: the session/active view model
     *      - results: a Results collection that contains the tabular data
     *      - exporters: a collection of supported exporters
     *      - queries: a collection of queries
     */
    var ResultsWorkflow = Marionette.Layout.extend({
        className: 'results-workflow',

        template: 'workflows/results',

        // In milliseconds
        requestDelay: 2500,

        // In milliseconds
        monitorDelay: 500,

        // Max time(ms) to monitor exports, 10 minutes
        monitorTimeout: 600000,

        numPendingDownloads: 0,

        // Pattern to match user entered export page ranges against. Any ranges
        // not matching this pattern will be considered invalid.
        pageRangePattern: /^[0-9]+(\.\.\.[0-9]+)?$/,

        ui: {
            saveQuery: '.save-query-modal',
            saveQueryToggle: '[data-toggle=save-query]',
            exportOptions: '.export-options-modal',
            exportProgress: '.export-progress-modal',
            toggleFiltersButton: '[data-toggle=context-panel]',
            toggleFiltersIcon: '[data-toggle=context-panel] i',
            toggleFiltersText: '[data-toggle=context-panel] span',
            navbar: '.results-workflow-navbar',
            resultsContainer: '.results-container',
            navbarButtons: '.results-workflow-navbar button',
            loadingOverlay: '.loading-overlay'
        },

        events: {
            'click .export-options-modal [data-save]': 'exportData',
            'click [data-toggle=export-options]': 'showExportOptions',
            'click [data-toggle=export-progress]': 'showExportProgress',
            'click #pages-text-ranges': 'selectPagesOption',
            'click [data-toggle=save-query]': 'showSaveQuery',
            'click [data-toggle=context-panel]': 'toggleContextPanelButtonClicked',
            'click [data-toggle=columns-dialog]': 'showColumnsDialog'
        },

        regions: {
            count: '.count-region',
            table: '.table-region',
            paginator: '.paginator-region',
            exportTypes: '.export-options-modal .export-type-region',
            exportProgress: '.export-progress-modal .export-progress-region',
            saveQueryModal: '.save-query-modal'
        },

        initialize: function() {
            // Bind for use as event handlers
            _.bindAll(this, 'onPageScroll', 'startExport', 'checkExportStatus');

            this.data = {};
            this.monitors = {};

            if (!(this.data.context = this.options.context)) {
                throw new Error('context model required');
            }
            if (!(this.data.view = this.options.view)) {
                throw new Error('view model required');
            }
            if (!(this.data.results = this.options.results)) {
                throw new Error('results collection required');
            }
            if (!(this.data.exporters = this.options.exporters)) {
                throw new Error('exporters collection required');
            }
            if (!(this.data.queries = this.options.queries)) {
                throw new Error('queries collection required');
            }

            this.data.results.on('request', this.showLoadingOverlay);
            this.data.results.on('sync', this.hideLoadingOverlay);

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

        showLoadingOverlay: function() {
            if (this.isClosed != null && !this.isClosed) {
                this.ui.loadingOverlay.show();
            }
        },

        hideLoadingOverlay: function() {
            if (this.isClosed != null && !this.isClosed) {
                this.ui.loadingOverlay.hide();
            }
        },

        toggleContextPanelButtonClicked: function() {
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
            // If the view isn't rendered yet, then don't bother.
            if (this.isClosed == null || this.isClosed) return;

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

        selectPagesOption: function() {
            this.$('#pages-radio-all').prop('checked', false);
            this.$('#pages-radio-ranges').prop('checked', true);
            this.$('#pages-text-ranges').val('');
        },

        changeExportStatus: function(title, newState) {
            var statusContainer = this.$('.export-status-' + title + ' .span10');

            statusContainer.children().hide();

            switch(newState) {
                case 'pending':
                    statusContainer.find('.pending-container').show();
                    break;
                case 'downloading':
                    statusContainer.find('.progress').show();
                    break;
                case 'error':
                    statusContainer.find('.label-important').show();
                    break;
                case 'success':
                    statusContainer.find('.label-success').show();
                    break;
                case 'timeout':
                    statusContainer.find('.label-timeout').show();
                    break;
            }
        },

        onExportFinished: function(exportTypeTitle) {
            this.numPendingDownloads--;

            this.$('.export-progress-container .badge-info')
                .html(this.numPendingDownloads);

            if (this.hasExportErrorOccurred(exportTypeTitle)) {
                this.changeExportStatus(exportTypeTitle, 'error');
            }
            else if (this.monitors[exportTypeTitle].execution_time > this.monitorTimeout) {
                this.changeExportStatus(exportTypeTitle, 'timeout');
            }
            else {
                this.changeExportStatus(exportTypeTitle, 'success');
            }

            // If all the downloads are finished, re-enable the export button.
            if (this.numPendingDownloads === 0) {
                this.$('[data-toggle=export-options]').prop('disabled', false);
                this.$('.export-progress-container').hide();
            }
        },

        hasExportErrorOccurred: function(exportTypeTitle) {
            // Since we can't read the content-type of the iframe directly,
            // we need to check to see if the body of the iframe is populated.
            // If it is populated, then an error during export has occurred and
            // the details of that error are contained in the iframe. If all
            // went well, the iframe will have empty head and body elements
            // because the content disposition was attachment.
            return this.$('#export-download-' + exportTypeTitle)
                .contents()[0].body.children.length !== 0;
        },

        checkExportStatus: function(exportTypeTitle) {
            var monitor = this.monitors[exportTypeTitle];

            monitor.execution_time = monitor.execution_time + this.monitorDelay;

            var cookieName = 'export-type-' + exportTypeTitle.toLowerCase();

            // Check if the download finished and the cookie was set.
            if (c.utils.getCookie(cookieName) === 'complete') {
                clearInterval(monitor.interval);
                c.utils.setCookie(cookieName, null);
                this.onExportFinished(exportTypeTitle);
            }

            // Check for a timeout, if we reached this point, we don't really
            // know what is going on so assume we missed something and the
            // download finished so take the best guess as to the result. Also,
            // check for an error. If an error occurred then kill the monitor
            // and send it to the completed handler.
            else if ((monitor.execution_time > this.monitorTimeout) ||
                     this.hasExportErrorOccurred(exportTypeTitle)) {

                clearInterval(monitor.interval);
                this.onExportFinished(exportTypeTitle);
            }
        },

        startExport: function(exportType, pages) {
            var title = this.$(exportType).attr('title');

            this.changeExportStatus(title, 'downloading');

            // Clear the cookie in case the Serrano version is new enough
            // to be setting the cookie in response.
            var cookieName = 'export-type-' + title.toLowerCase();
            c.utils.setCookie(cookieName, null);

            var url = this.$(exportType).attr('href');

            if (url[url.length-1] != '/') url = '' + url + '/';

            url = '' + url + pages;

            var iframe = '<iframe id=export-download-' + title + ' src=' +
                         url + ' style="display: none"></iframe>';
            this.$('.export-iframe-container').append(iframe);

            this.monitors[title] = {
                'execution_time': 0,
                'interval': setInterval(this.checkExportStatus, this.monitorDelay, title)
            };
        },

        initializeExportStatusIndicators: function(selectedTypes) {
            // Start by hiding all of them.
            this.$('.export-status-container').children().hide();

            for (var i = 0; i < selectedTypes.length; i++) {
                this.$('.export-status-' + selectedTypes[i].title).show();
            }
        },

        isPageRangeValid: function() {
            if (this.$('input[name=pages-radio]:checked').val() === 'all') {
                return true;
            }

            return this.pageRangePattern.test(this.$('#pages-text-ranges').val());
        },

        exportData: function(event) {
            // Clear any of the old iframes. If we are exporting again, these
            // downloads should all have finished based on the UI blocking
            // during active exports.
            this.$('.export-iframe-container').html('');

            var selectedTypes = this.$('input[name=export-type-checkbox]:checked');

            if (selectedTypes.length === 0) {
                this.$('#export-error-message').html('An export type must be selected.');
                this.$('.export-options-modal .alert-block').show();
            }
            else if (!this.isPageRangeValid()) {
                this.$('#export-error-message').html('Page range is invalid. Must be a single page(example: 1) or a range of pages(example: 2...5).');
                this.$('.export-options-modal .alert-block').show();
            }
            else {
                this.numPendingDownloads = selectedTypes.length;

                var pagesSuffix = '';
                if (this.$('input[name=pages-radio]:checked').val() !== 'all') {
                    pagesSuffix = this.$('#pages-text-ranges').val() + '/';
                }

                // Disable export button until the downloads finish.
                this.$('[data-toggle=export-options]').prop('disabled', true);
                this.$('.export-progress-container').show();
                this.$('.export-progress-container .badge-info').html(this.numPendingDownloads);

                this.ui.exportOptions.modal('hide');

                this.initializeExportStatusIndicators(selectedTypes);

                this.ui.exportProgress.modal('show');

                // Introduce an artificial delay in between download requests
                // to keep the browser from freaking out about too many
                // simultaneous download requests.
                for (var i = 0; i < selectedTypes.length; i++) {
                    this.changeExportStatus(this.$(selectedTypes[i]).attr('title'), 'pending');

                    setTimeout(this.startExport, i * this.requestDelay,
                        selectedTypes[i], pagesSuffix);
                }
            }
        },

        onRender: function() {
            $(document).on('scroll', this.onPageScroll);

            // Remove unsupported features from view/
            if (!c.isSupported('2.1.0')) {
                this.ui.saveQueryToggle.remove();
                this.ui.saveQuery.remove();
            }

            this.paginator.show(new paginator.Paginator({
                model: this.data.results
            }));

            this.count.show(new ResultCount({
                model: this.data.results
            }));

            this.exportTypes.show(new exporter.ExportTypeCollection({
                collection: this.data.exporters
            }));

            this.exportProgress.show(new exporter.ExportProgressCollection({
                collection: this.data.exporters
            }));

            this.saveQueryModal.show(new query.EditQueryDialog({
                header: 'Save Query',
                view: this.data.view,
                context: this.data.context,
                collection: this.data.queries
            }));

            this.table.show(new tables.Table({
                view: this.data.view,
                collection: this.data.results
            }));


            this.ui.navbarButtons.tooltip({
                animation: false,
                placement: 'bottom'
            });
        },

        onClose: function() {
            $(document).off('scroll', this.onPageScroll);
        },

        showExportOptions: function() {
            this.$('.export-options-modal .alert-block').hide();
            this.ui.exportOptions.modal('show');

            if (this.data.exporters.length === 0) {
                this.$('.export-options-modal .btn-primary').prop('disabled', true);
            }
        },

        showExportProgress: function() {
            this.ui.exportProgress.modal('show');
        },

        showColumnsDialog: function() {
            c.dialogs.columns.open();
        },

        showSaveQuery: function() {
            // Opens the query modal without passing a model which assumes a
            // new one will be created based on the current session.
            this.saveQueryModal.currentView.open();
        }
    });

    return {
        ResultCount: ResultCount,
        ResultsWorkflow: ResultsWorkflow
    };
});
