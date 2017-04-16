/* global define */

define([
    'jquery',
    'marionette'
], function($, Marionette) {

    var Cell = Marionette.View.extend({
        tagName: 'td',

        initialize: function() {
            this.listenTo(this.model.index, 'change:visible', this.toggleVisible);
        },

        render: function() {
            this.toggleVisible();
            var value = this.model.get('value');

            //false boolean values come back as empty objects
            if (typeof value === 'object' && $.isEmptyObject(value)) {
                this.$el.html('False');
            } else {
                if (value === true) {
                    this.$el.html('True');
                } else {
                    this.$el.html(value);
                }
            }
            return this;
        },

        toggleVisible: function() {
            this.$el.toggle(this.model.index.get('visible'));
        }
    });

    return {
        Cell: Cell
    };

});
