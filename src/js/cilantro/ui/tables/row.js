/* global define */

define([
    'underscore',
    'marionette',
    '../base',
    './cell'
], function(_, Marionette, base, cell) {

    var Row = Marionette.CollectionView.extend({
        tagName: 'tr',

        itemView: cell.Cell,

        itemViewOptions: function(model) {
            return _.extend({}, this.options, {
                model: model
            });
        }
    });

    var EmptyRow = base.LoadView.extend({
        align: 'left',

        tagName: 'tr'
    });

    return {
        EmptyRow: EmptyRow,
        Row: Row
    };

});
