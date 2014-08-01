/* global define */

define([
    'jquery',
    'underscore',
    'marionette',
    './body',
    './header',
    './footer'
], function($, _, Marionette, body, header, footer) {

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
            this.listenTo(this, 'render', this.resize, this);
            _.bindAll(this, 'resize');
            $(window).resize(this.resize);
        },

        resize: function() {
            var tbody = $('tbody');

            if (tbody.height() > 0) {
                var rows, rlength, row, colls, clength, width, coll;

                this.$el.children().each(function() {
                    rows = this.rows;
                    rlength = rows.length;
                    for(var r = 0; r < rlength; r++) {
                        row = rows[r];
                        colls = row.cells;
                        clength = colls.length;
                        width = $(document).width() / clength;

                        for(var c = 0; c < clength; c++) {
                            coll = colls[c];
                            $(coll).css('width', width);
                            $(coll).css('max-width', width);
                        }
                    }
                });
                
                var offset = tbody.height() + parseInt(tbody.css('top').replace('px',''));

                // When width exceeds 979, bootstrap-responsive.css sets navbar-fixed-top
                // position to static, so the same needs to be done for tbody and footer. 
                if ($(document).width() > 979) {
                    $('#footer').offset({top:offset});
                    tbody.css('position','absolute');
                } else {
                    $('#footer').css('position','static');
                    tbody.css('position','static');
                }
            }
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
