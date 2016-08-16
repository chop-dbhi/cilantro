/* global define */

define([
    'underscore',
    'marionette',
    '../base',
    '../core',
    './filters',
    './groups',
    './operator',
    './info',
    './actions'
], function(_, Marionette, base, c, filters, groups, operator, info, actions) {


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
            operator: '.operator-region',
            groups: '.groups-region',
            filters: '.filters-region',
            actions: '.actions-region'
        },

        regionViews: {
            info: info.ContextInfo,
            operator: operator.ContextOperator,
            groups: groups.ContextGroups,
            filters: filters.ContextFilters,
            actions: actions.ContextActions
        },

        initialize: function() {
            this.data = {};

            if (!(this.data.contexts = this.options.contexts)) {
                throw new Error('context collection required');
            }
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

            var groups = new this.regionViews.groups({
                model: this.model,
                collection: this.data.contexts
            });

            var filters = new this.regionViews.filters({
                model: this.model,
                collection: this.model.filters
            });

            var operator = new this.regionViews.operator({
              model: this.model
            });

            this.info.show(info);
            this.actions.show(actions);
            this.filters.show(filters);
            this.operator.show(operator);
            this.groups.show(groups);
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
