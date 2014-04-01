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
            'add remove reset apply unapply': 'renderRemoveAll'
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
            this.ui.removeAll.prop('disabled', !this.collection.length);
        }
    });


    return {
        ContextActions: ContextActions
    };

});
