/* global define */

define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    './base',
    './core'
], function($, _, Backbone, Marionette, base, c) {

    var ExportOption = Marionette.ItemView.extend({
        tagName: 'label',

        className: 'checkbox',

        template: 'export/option'
    });


    var NoExportOption = base.EmptyView.extend({
        message: 'No exporters available.'
    });


    var ExportOptions = Marionette.CollectionView.extend({
        itemView: ExportOption,

        emptyView: NoExportOption
    });


    var ExportProgress = Marionette.ItemView.extend({
        template: 'export/progress',

        ui: {
            status: '[data-target=status]',
            cancel: '[data-target=cancel]'
        },

        events: {
            'click @ui.cancel': 'cancel'
        },

        modelEvents: {
            'change:status': 'renderStatus'
        },

        // TODO this is bound to the implementation Serrano provides
        // and needs to be noted somewhere.
        getCookieName: function() {
            return 'export-type-' + this.model.get('type');
        },

        getExportUrl: function() {
            var url = this.model.get('uri');

            if (url.charAt(url.length - 1) !== '/') {
                url += '/';
            }

            return url + (this.model.get('pages') || '');
        },

        initialize: function() {
            var cookie = this.getCookieName(),
                url = this.getExportUrl();

            this.iframe = $('<iframe />').attr('src', url).css('display', 'none');

            this.model.set({
                url: url,
                cookie: cookie,
                status: 'pending',
                time: 0
            });
        },

        start: function(options) {
            if (this.model.get('status') === 'canceled') return;

            // Reset the cookie
            c.utils.setCookie(this.model.get('cookie'), null);

            // Append iframe to trigger browser to load
            this.$el.append(this.iframe);

            var _this = this;

            var interval = setInterval(function() {
                _this.check();
            }, options.monitorDelay);

            this.model.set({
                interval: interval,
                status: 'loading'
            });
        },

        cancel: function() {
            var cookie = this.model.get('cookie'),
                interval = this.model.get('interval');

            clearInterval(interval);
            c.utils.setCookie(cookie, null);

            this.iframe.remove();
            this.model.set('status', 'canceled');

            // Send DELETE request to cancel the backend processing.
            $.ajax({
                type: 'DELETE',
                url: this.getExportUrl(),
                contentType: 'application/json'
            });
        },

        check: function() {
            var cookie = this.model.get('cookie'),
                time = this.model.get('time'),
                interval = this.model.get('interval');

            // Update execution time
            time += this.monitorDelay;

            // Check if the export completed
            if (c.utils.getCookie(cookie) === 'complete') {
                clearInterval(interval);
                c.utils.setCookie(cookie, null);
                this.model.set('status', 'complete');
            }

            // A timeout occurred
            else if (time >= this.options.monitorTimeout) {
                clearInterval(interval);
                this.model.set('status', 'timeout');
            }

            // An error occurred
            else if (this.checkError()) {
                clearInterval(interval);
                this.model.set('status', 'error');
            }
        },

        checkError: function() {
            if (!this.iframe[0].document) return false;

            // Since we can't read the content-type of the iframe directly,
            // we need to check to see if the body of the iframe is populated.
            // If it is populated, then an error during export has occurred and
            // the details of that error are contained in the iframe. If all
            // went well, the iframe will have empty head and body elements
            // because the content disposition was attachment.
            return this.iframe.contents()[0].body.children.length !== 0;
        },

        renderStatus: function(model, value) {
            var html, done = true;

            switch(value) {
                case 'error':
                    html = '<span class="label label-important">Error</span>';
                    break;
                case 'timeout':
                    html = '<span class="label label-warning">Request Timed Out</span>';
                    break;
                case 'complete':
                    html = '<span class="label label-success">Complete</span>';
                    break;
                case 'loading':
                    html = '<div class="label label-info">' +
                        '<i class="icon-spinner icon-spin"></i> Downloading...</span>';
                    // I'm stil working, I promise I'll be done soon!
                    done = false;
                    break;
                case 'canceled':
                    html = '<span class="label label-warning">Canceled</span>';
                    break;
            }

            this.ui.status.html(html);
            this.model.set('done', done);
        }
    });


    var ExportBatch = Marionette.CompositeView.extend({
        className: 'export-batch',

        template: 'export/batch',

        itemView: ExportProgress,

        start: function() {
            var options = this.options;

            this.children.each(function(view, i) {
                _.delay(function() {
                    view.start(options);
                }, i * options.requestDelay);
            });
        },

        finish: function() {
            var _this = this;

            this.$el
                .html('<h3><i class="icon-ok-sign text-success" /> Export Done</h3>')
                .css('text-align', 'center');

            _.delay(function() {
                _this.$el.slideUp({
                    duration: 300,
                    easing: 'easeInOutQuad',
                    complete: function() {
                        _this.close();
                    }
                });
            }, 2000);
        }

    });


    // Pattern to match user entered export page ranges against. Any ranges
    // not matching this pattern will be considered invalid.
    var pageRangePattern = /^[0-9]+(\.\.\.[0-9]+)?$/;


    var ExporterDialog = Marionette.Layout.extend({
        template: 'export/dialog',

        id: 'exporter-dialog',

        className: 'modal hide',

        options: {
            // In milliseconds
            requestDelay: 500,

            // In milliseconds
            monitorDelay: 200,

            // Max time(ms) to monitor exports, 10 minutes
            monitorTimeout: 600000
        },

        ui: {
            pageOption: '[name=pages]',
            pageRange: '[name=page-range]',
            error: '[data-target=error]',
            save: '[data-toggle=save]'
        },

        events: {
            'click @ui.save': 'exportData',
            'click @ui.pageOption': 'togglePageOption',
            'click [data-action=change-columns]': 'changeColumnsClicked'
        },

        regions: {
            types: '[data-target=types]',
            progress: '[data-target=progress]'
        },

        initialize: function() {
            this.data = {};

            if (!(this.data.exporters = this.options.exporters)) {
                throw new Error('exporters collection required');
            }
        },

        open: function() {
            this.$el.modal('show');
        },

        hide: function() {
            this.$el.modal('hide');
        },

        onRender: function() {
            this.$el.modal({show: false});

            var optionsRegion = new ExportOptions({
                collection: this.data.exporters
            });

            this.types.show(optionsRegion);
        },

        // Enables/disables the page range text box based on the selected
        // radio button
        togglePageOption: function() {
            this.ui.pageRange.prop('disabled', !this.pageRangeSelected());
        },

        // Returns an array of export type models based on the current selection
        getSelectedOptions: function() {
            return this.types.currentView.$(':checked').map(function() {
                return this.value;
            });
        },

        getPageRange: function() {
            if (this.pageRangeSelected()) {
                return this.ui.pageRange.val();
            }
        },

        pageRangeSelected: function() {
            return this.ui.pageOption.filter(':checked').val() === 'range';
        },

        isPageRangeValid: function() {
            return pageRangePattern.test(this.getPageRange());
        },

        changeColumnsClicked: function() {
            c.dialogs.columns.open();
        },

        validate: function() {
            var errors = [];

            // Get export options that were selected
            var options = this.getSelectedOptions();

            if (this.pageRangeSelected() && !this.isPageRangeValid()) {
                errors.push('<p>The page range entered is invalid. It must be a ' +
                            'single page, e.g. 1, or a range of pages, e.g. 2...5.</p>');
            }
            if (options.length === 0) {
                errors.push('<p>An export type must be selected.</p>');
            }
            if (c.data.views.session.facets.length === 0){
                errors.push('<p>One or more columns must be selected. Click ' +
                            '<a data-action=change-columns>here</a> to select '+
                            'columns.</p>');
            }
            return errors;
        },

        // Starts a data export for all selected options
        exportData: function() {
            // Clear any of the old iframes. If we are exporting again, these
            // downloads should all have finished based on the UI blocking
            // during active exports.
            this.ui.error.hide();

            // Get export options selected by user
            var options = this.getSelectedOptions();

            // Return a list of errors
            var errors = this.validate();

            // Show a list of errors if they exist
            if (errors.length) {
                this.ui.error.html(errors).show();
                return;
            }

            // Disable export button until the downloads finish.
            this.ui.save.prop('disabled', true);

            var _this = this, attrs;

            var models = _.map(options, function(option) {
                attrs = _this.data.exporters.get(option).toJSON();

                // Add additional attributes for this batch
                attrs.pages = _this.getPageRange();
                return attrs;
            });

            // Initial batch of export options
            var batch = new Backbone.Collection(models);

            this.listenTo(batch, 'change:status', function() {
                if (batch.where({done: true}).length === batch.length) {
                    this.stopListening(batch);
                    this.ui.save.prop('disabled', false);

                    _.delay(function() {
                        progress.finish();
                    }, 1000);
                }
            });

            // Initialize batch with local options including timeouts and such
            var progress = new ExportBatch(_.extend({
                collection: batch
            }, this.options));

            this.progress.show(progress);

            progress.start();
        }
    });

    return {
        ExporterDialog: ExporterDialog
    };

});
