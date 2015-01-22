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
            'sync': 'enableRefreshButton',
            'change': 'disableRefreshButton'
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

            attrs.showDistinctButton = !c.config.get('distinctCountAutoRefresh');

            return attrs;
        },

        clickRemoveAll: function() {
            this.collection.unapply();
        },

        onRender: function() {
            this.renderRemoveAll();
        },

        showLoad: function() {
            this.ui.count.hide();
            this.ui.units.hide();
            if (c.config.get('distinctCountAutoRefresh')) {
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
            this.ui.refresh.removeProp('disabled');
        },
        
        disableRefreshButton: function() {
            this.ui.refresh.prop('disabled', true);
            this.ui.loading.hide();
        },

        renderRemoveAll: function() {
            // Required filters cannot be removed, so filter them out
            var models = this.collection.reject(function(model) {
                return model.get('required') === true;
            });

            this.ui.removeAll.prop('disabled', !models.length);
        },

        refreshCount:function(){
           this.model.stats.manualFetch();
           this.ui.refresh.prop('disabled', true);
           this.ui.loading.show();
        }
    });


    return {
        ContextActions: ContextActions
    };

});
