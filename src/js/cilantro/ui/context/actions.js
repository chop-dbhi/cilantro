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
            removeAll: '[data-target=remove]'
        },

        events: {
            'click @ui.removeAll': 'clickRemoveAll'
        },

        modelEvents: {
            'change': 'render'
        },

        serializeData: function() {
            var attrs = _.clone(this.model.attributes);
            attrs.prettyCount = c.utils.prettyNumber(attrs.count);
            return attrs;
        },

        clickRemoveAll: function() {
            this.model.manager.clear();
        },

        onRender: function() {
            this.ui.removeAll.prop('disabled', !this.model.get('json'));
        }
    });


    return {
        ContextActions: ContextActions
    };

});
