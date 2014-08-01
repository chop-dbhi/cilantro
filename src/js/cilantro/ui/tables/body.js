/* global define */

define([
    'jquery',
    'underscore',
    'marionette',
    './row'
], function($, _, Marionette, row) {

    // Represent a "frame" of rows. The model is referenced for keeping
    // track which frame this is relative to the whole series.
    var Body = Marionette.CollectionView.extend({
        tagName: 'tbody',

        itemView: row.Row,

        onRender: function() {
            var offset = 0;

            $('.navbar-fixed-top').each(function() {
                offset += this.clientHeight;
            });

            this.$el.css('top', offset);
            this.$el.css('position', 'absolute');
        },

        itemViewOptions: function(model) {
            return _.defaults({collection: model.data}, this.options);
        }
    });

    return {
        Body: Body
    };

});
