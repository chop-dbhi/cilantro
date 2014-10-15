/* global define */

define([
    'jquery',
    'marionette'
], function($, Marionette) {

    var CountItem = Marionette.ItemView.extend({
        tagName: 'tr',

        template: 'stats/count-item'
    });

    var CountList = Marionette.CompositeView.extend({
        template: 'stats/count-list',

        itemView: CountItem,

        itemViewContainer: 'tbody',

        ui: {
            'statsTable': 'table',
            'loader': '.loading-message'
        },

        events: {
            'click thead th': 'handleSort'
        },

        collectionEvents: {
            'sort': '_renderChildren',
            'request': 'showLoader',
            'reset': 'hideLoader'
        },

        hideLoader: function() {
            this.ui.loader.hide();
            this.ui.statsTable.show();
        },

        showLoader: function() {
            this.ui.loader.show();
            this.ui.statsTable.hide();
        },

        handleSort: function(event) {
            if (!this.collection.length) return;

            this.applySort($(event.target).data('sort'));
        },

        applySort: function(attr) {
            var dir = 'asc';

            // Already sorted by the attribute, cycle direction.
            if (this.collection._sortAttr === attr) {
                dir = this.collection._sortDir === 'asc' ? 'desc' : 'asc';
            }

            this.$('[data-sort=' + this.collection._sortAttr + ']')
                .removeClass(this.collection._sortDir);
            this.$('[data-sort=' + attr + ']').addClass(dir);

            // Reference for cycling.
            this.collection._sortAttr = attr;
            this.collection._sortDir = dir;

            // Parse function for handling the sort attributes.
            var parse = function(v) {
                return v;
            };

            this.collection.comparator = function(m1, m2) {
                var v1 = parse(m1.get(attr)),
                    v2 = parse(m2.get(attr));

                if (v1 < v2) return (dir === 'asc' ? -1 : 1);
                if (v1 > v2) return (dir === 'asc' ? 1 : -1);

                return 0;
            };

            this.collection.sort();
        }
    });

    return {
        CountList: CountList
    };

});
