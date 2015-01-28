/* global define */

define([
    'underscore',
    'marionette',
    '../core'
], function(_, Marionette, c) {


    // Provides a set of actions for manipulating a ContextModel object
    var ContextActions = Marionette.ItemView.extend({
        template: 'context/actions',

        ui: {
            removeAll: '[data-action=remove]',
            count: '[data-target=count]',
            units: '[data-target=units]',
            loading: '[data-target=loading-message]',
            refresh: '[data-action=refresh]'
        },

        events: {
            'click @ui.removeAll': 'clickRemoveAll',
            'click @ui.refresh': 'refreshCount'
        },

        modelEvents: {
            'request': 'showLoad',
            'sync': 'enableRefreshButton'
        },

        collectionEvents: {
            'add remove reset': 'renderRemoveAll'
        },

        initialize: function() {
            this.model.stats.on('sync', this.showCount, this);
        },

        serializeData: function() {
            var attrs = _.clone(this.model.attributes);

            attrs.count = this.model.stats.get('count');
            attrs.prettyCount = c.utils.prettyNumber(
                attrs.count, c.config.get('threshold'));

            return attrs;
        },

        clickRemoveAll: function() {
            this.collection.unapply();
        },

        onRender: function() {
            this.renderRemoveAll();
        },

        showLoad: function() {
            if (c.config.get('distinctCountAutoRefresh')) {
                this.ui.count.hide();
                this.ui.units.hide();
                this.ui.loading.show();
            }
        },

        showCount: function() {
            this.ui.count.show();
            this.ui.units.show();
            this.ui.loading.hide();
            this.render();
        },

        enableRefreshButton: function() {
            if (!c.config.get('distinctCountAutoRefresh')) {
                this.$el.addClass('muted');
                this.ui.refresh.show();
            }
        },

        renderRemoveAll: function() {
            // Required filters cannot be removed, so filter them out
            var models = this.collection.reject(function(model) {
                return model.get('required') === true;
            });

            this.ui.removeAll.prop('disabled', !models.length);
        },

        refreshCount:function() {
            this.model.stats.manualFetch();
            this.$el.removeClass('muted');
            this.ui.refresh.hide();
            this.ui.count.hide();
            this.ui.units.hide();
            this.ui.loading.show();
        }
    });


    return {
        ContextActions: ContextActions
    };

});
