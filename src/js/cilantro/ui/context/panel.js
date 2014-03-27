/* global define */

define([
    'underscore',
    'marionette',
    '../base',
    '../core',
    './tree',
    './info',
    './actions'
], function(_, Marionette, base, c, tree, info, actions) {


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
            tree: '.tree-region',
            actions: '.actions-region'
        },

        regionViews: {
            info: info.ContextInfo,
            tree: tree.ContextTree,
            actions: actions.ContextActions
        },

        showLoadView: function() {
            this.$el.addClass('loading');
        },

        hideLoadView: function() {
            this.$el.removeClass('loading');
        },

        showErrorView: function() {
            // Show an overlay for the whole tree region
            var view = new this.errorView({target: this.$el});
            view.render();
        },

        onRender: function() {
            // Initialize panel to set default state
            this.$el.panel();

            var info = new this.regionViews.info({
                model: this.model
            });

            var actions = new this.regionViews.actions({
                model: this.model
            });

            var tree = new this.regionViews.tree({
                model: this.model,
                collection: this.model.manager.upstream.children
            });

            this.info.show(info);
            this.actions.show(actions);
            this.tree.show(tree);
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
