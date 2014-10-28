/* global define */

define([
    'jquery',
    'underscore',
    'marionette'
], function($, _, Marionette) {

    var CountItem = Marionette.ItemView.extend({
        tagName: 'tr',

        template: 'stats/count-item',

        templateHelpers: function() {
            var name = this.model.get('verbose_name');

            if (this.model.get('count') > 1) {
                name = this.model.get('verbose_name_plural');
            }

            return {
                displayName: name
            };
        }
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
            'reset': 'onCollectionReset'
        },

        onCollectionReset: function() {
            this.hideLoader();

            if (this.options.statsModelsList !== null) {
                var _this = this;

                var summaryCollection = _.filter(this.collection.models, function(count) {
                    var appModel = count.get('app_name') + '.' + count.get('model_name');
                    return _this.options.statsModelsList.indexOf(appModel) !== -1;
                });

                this.collection.reset(summaryCollection, {silent: true});
            }
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
