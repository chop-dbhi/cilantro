/* global define */

define([
    'underscore',
    'marionette',
    './row'
], function(_, Marionette, row) {

    // Represent a "frame" of rows. The model is referenced for keeping
    // track which frame this is relative to the whole series.
    var Body = Marionette.CollectionView.extend({
        tagName: 'tbody',

        itemView: row.Row,

        itemViewOptions: function(model) {
            return _.defaults({collection: model.data}, this.options);
        }
    });

    return {
        Body: Body
    };

});
