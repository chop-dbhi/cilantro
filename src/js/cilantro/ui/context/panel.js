/* global define */

define([
    'underscore',
    'marionette',
    '../base',
    '../core',
    './filters',
    './info',
    './actions'
], function(_, Marionette, base, c, filters, info, actions) {


    var ContextPanel = Marionette.Layout.extend({
        id: 'context-panel',

        className: 'panel panel-right closed',

        template: 'context/panel',

        errorView: base.ErrorOverlayView,

        modelEvents: {
            sync: 'hideLoadView',
            error: 'showErrorView',
            request: 'showLoadView'
        },

        regions: {
            info: '.info-region',
            filters: '.filters-region',
            actions: '.actions-region'
        },

        regionViews: {
            info: info.ContextInfo,
            filters: filters.ContextFilters,
            actions: actions.ContextActions
        },

        showLoadView: function() {
            if (this._errorView) {
                this._errorView.remove();
                delete this._errorView;
            }

            this.$el.addClass('loading');
        },

        hideLoadView: function() {
            this.$el.removeClass('loading');
        },

        showErrorView: function() {
            if (this._errorView) return;

            // Show an overlay for the whole filters region
            this._errorView = new this.errorView({target: this.$el});
            this._errorView.render();
        },

        onRender: function() {
            // Initialize panel to set default state
            this.$el.panel();

            var info = new this.regionViews.info({
                model: this.model
            });

            var actions = new this.regionViews.actions({
                model: this.model,
                collection: this.model.filters
            });

            var filters = new this.regionViews.filters({
                model: this.model,
                collection: this.model.filters
            });

            this.info.show(info);
            this.actions.show(actions);
            this.filters.show(filters);
        },

        openPanel: function(options) {
            this.$el.panel('open', options);
        },

        closePanel: function(options) {
            this.$el.panel('close', options);
        },

        isPanelOpen: function(options) {
            return this.$el.data('panel').isOpen(options);
        },

        isPanelClosed: function(options) {
            return this.$el.data('panel').isClosed(options);
        }
    });


    return {
        ContextPanel: ContextPanel
    };


});
