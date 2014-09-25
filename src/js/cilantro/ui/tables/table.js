/* global define */

define([
    'underscore',
    'marionette',
    './body',
    './header',
    './footer'
], function(_, Marionette, body, header, footer) {

    // Renders a table with the thead and tfoot elements and one or more
    // tbody elements each representing a frame of data in the collection.
    var Table = Marionette.CollectionView.extend({
        tagName: 'table',

        className: 'table table-striped',

        itemView: body.Body,

        itemViewOptions: function(item) {
            return _.defaults({collection: item.series}, this.options);
        },

        collectionEvents: {
            'change:currentpage': 'showCurrentPage'
        },

        initialize: function() {
            this.header = new header.Header(_.defaults({
                collection: this.collection.indexes
            }, this.options));

            this.footer = new footer.Footer(_.defaults({
                collection: this.collection.indexes
            }, this.options));

            this.header.render();
            this.footer.render();

            this.$el.append(this.header.el, this.footer.el);

            this.listenTo(this.collection, 'reset', function() {
                if (this.collection.objectCount === 0) {
                    this.$el.hide();
                }
                else {
                    this.$el.show();
                }
            });
        },

        showCurrentPage: function(model, num) {
            this.children.each(function(view) {
                view.$el.toggle(view.model.id === num);
            });
        }
    });

    return {
        Table: Table
    };

});
