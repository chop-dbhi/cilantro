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

        renderCount: function(model, count) {
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
            loadingOverlay: '.loading-overlay'
        },

        events: {
            'click [data-toggle=columns-dialog]': 'showColumnsDialog',
            'click [data-toggle=exporter-dialog]': 'showExporterDialog',
            'click [data-toggle=query-dialog]': 'showQueryDialog',
            'click [data-toggle=context-panel]': 'toggleContextPanel'
        },

        regions: {
            count: '.count-region',
            table: '.table-region',
            paginator: '.paginator-region'
        },

        initialize: function() {
            this.data = {};

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

        showLoadingOverlay: function() {
            if (this.isClosed !== true) {
                this.ui.loadingOverlay.show();

                // Render above all but navbar-inverse @ 1030.
                this.ui.loadingOverlay.css('z-index', '1029');
            }
        },

        hideLoadingOverlay: function() {
            if (this.isClosed !== true) this.ui.loadingOverlay.hide();
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

        onRender: function() {
            this.ui.navbar.css('top', $('.navbar-fixed-top').height());
            this.ui.navbar.addClass('navbar-fixed-top');

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
        }
    });

    return {
        ResultCount: ResultCount,
        ResultsWorkflow: ResultsWorkflow
    };
});
