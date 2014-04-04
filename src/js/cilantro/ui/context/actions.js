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
            removeAll: '[data-action=remove]'
        },

        events: {
            'click @ui.removeAll': 'clickRemoveAll'
        },

        modelEvents: {
            'change:count': 'render'
        },

        collectionEvents: {
            'add remove reset change': 'renderRemoveAll'
        },

        serializeData: function() {
            var attrs = _.clone(this.model.attributes);
            attrs.prettyCount = c.utils.prettyNumber(attrs.count);
            return attrs;
        },

        clickRemoveAll: function() {
            this.collection.unapply();
        },

        onRender: function() {
            this.renderRemoveAll();
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
