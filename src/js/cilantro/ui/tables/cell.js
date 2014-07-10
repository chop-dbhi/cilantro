/* global define */

define([
    'marionette'
], function(Marionette) {

    var Cell = Marionette.View.extend({
        tagName: 'td',

        initialize: function() {
            this.listenTo(this.model.index, 'change:visible', this.toggleVisible);
        },

        render: function() {
            this.toggleVisible();
            this.$el.html(this.model.get('value'));
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
