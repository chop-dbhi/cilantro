/* global define */

define([
    'jquery',
    'underscore',
    'marionette',
    './row'
], function($, _, Marionette, row) {

    var HeaderCell = Marionette.ItemView.extend({
        tagName: 'th',

        events: {
            'click': 'onClick'
        },

        constructor: function(options) {
            if (!options.view) {
                throw new Error('ViewModel instance required');
            }

            this.view = options.view;
            delete options.view;
            Marionette.ItemView.prototype.constructor.call(this, options);
        },

        onClick: function() {
            _.each(this.view.facets.models, function(f) {
                var direction;

                if (f.get('concept') === this.model.id) {
                    direction = f.get('sort');

                    if (direction) {
                        if (direction.toLowerCase() === "asc") {
                            f.set('sort', "desc");
                            f.set('sort_index', 0);
                        }
                        else {
                            f.unset('sort');
                            f.unset('sort_index');
                        }
                    }
                    else {
                        f.set('sort', "asc");
                        f.set('sort_index', 0);
                    }
                }
                else {
                    f.unset('sort');
                    f.unset('sort_index');
                }
            }, this);

            this.view.save();
        },

        initialize: function() {
            this.listenTo(this.model, 'change:visible', this.toggleVisible);
        },

        // Finds and returns the sort icon html associatied with the sort
        // direction of the Facet being represented by this header cell.
        getSortIconClass: function() {
            var direction, model;

            model = this.view.facets.findWhere({concept: this.model.id});

            // If there are no view facets for the this header cell's model
            // then the this really shouldn't be displaying anyway so return
            // the empty string. We really should not ever get into this
            // situation since the facets should be driving the columns but
            // this check prevents TypeErrors just in case.
            if (!model) return;

            direction = (model.get('sort') || '').toLowerCase();

            switch (direction) {
                case 'asc':
                    return 'icon-sort-up';
                case 'desc':
                    return 'icon-sort-down';
                default:
                    return 'icon-sort';
            }
        },

        render: function() {
            this.toggleVisible();

            var iconClass = this.getSortIconClass();

            // TODO: Could we just use a template here instead and then just
            // modify the class on the icon in the template?
            this.$el.html('<span>' + (this.model.get('name')) + ' <i class=' +
                          iconClass + '></i></span>');
            this.$el.attr('title', this.model.get('name'));

            return this;
        },

        toggleVisible: function() {
            this.$el.toggle(this.model.get('visible'));
        }
    });

    var HeaderRow = row.Row.extend({
        itemView: HeaderCell
    });

    var Header = Marionette.ItemView.extend({
        tagName: 'thead',

        resize: function() {
            if(this.row.children.length > 0) {
                var width = $(document).width() / this.row.children.length;
                this.row.children.each(function(cell) {
                    cell.$el.css('width', width);
                    cell.$el.css('max-width', width);
                });
            }
        },

        render: function() {
            var row = new HeaderRow(this.options);

            this.row = row;
            this.$el.html(row.el);

            this.listenTo(row, 'render', this.resize, this);
            _.bindAll(this, 'resize');
            $(window).resize(this.resize);

            row.render();

            var offset = 0;

            $('.navbar-fixed-top').each(function() {
                offset += this.clientHeight;
            });

            this.$el.css('top', offset);
            this.$el.css('background-color', 'white');
            this.$el.css('border-bottom', '1px solid #dddddd');

            // Display below filters @ z-index of 100.
            this.$el.css('z-index', '99');
            this.$el.addClass('navbar-fixed-top');

            return this;
        }
    });

    return {
        Header: Header
    };

});
