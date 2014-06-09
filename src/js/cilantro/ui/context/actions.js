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
            loading: '[data-target=loading-message]'
        },

        events: {
            'click @ui.removeAll': 'clickRemoveAll'
        },

        modelEvents: {
            'change:count': 'render',
            'sync': 'showCount',
            'request': 'showLoad'
        },

        collectionEvents: {
            'add remove reset': 'renderRemoveAll'
        },

        serializeData: function() {
            var attrs = _.clone(this.model.attributes);
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
            this.ui.count.hide();
            this.ui.units.hide();
            this.ui.loading.show();
        },

        showCount: function() {
            this.ui.count.show();
            this.ui.units.show();
            this.ui.loading.hide();
        },

        renderRemoveAll: function() {
            // Required filters cannot be removed, so filter them out
            var models = this.collection.reject(function(model) {
                return model.get('required') === true;
            });

            this.ui.removeAll.prop('disabled', !models.length);
        }
    });


    return {
        ContextActions: ContextActions
    };

});
