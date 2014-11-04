/* global define */

define([
    'underscore',
    'backbone',
    './models/base'
], function(_, Backbone, base) {

    var Index = Backbone.Model.extend({
        defaults: {
            visible: true
        },

        show: function() {
            this.set({
                visible: true
            });
        },

        hide: function() {
            this.set({
                visible: false
            });
        }
    });

    var Indexes = Backbone.Collection.extend({
        model: Index
    });

    var Datum = Backbone.Model.extend({
        constructor: function(attrs, index, options) {
            if (!(index instanceof Index)) {
                index = new Index(index);
            }

            this.index = index;

            Backbone.Model.prototype.constructor.call(this, attrs, options);
        },

        size: function() {
            return 1;
        },

        width: function() {
            return 1;
        }
    });

    // A collection of Datum objects which serves as an internal container for
    // the Series.
    var _DatumArray = Backbone.Collection.extend({
        constructor: function(attrs, indexes, options) {
            this.indexes = indexes;

            var _this = this;

            this.model = function(value, options) {
                // Collections length are not updated immediately so this uses the
                // internal hash to determine the next index.
                var index = _this.indexes.at(_.keys(_this._byId).length);

                Datum.prototype.constructor.call(this, {value: value}, index, options);
            };

            this.model.prototype = Datum.prototype;

            Backbone.Collection.prototype.constructor.call(this, attrs, options);
        }
    });

    var Series = Backbone.Model.extend({
        constructor: function(attrs, indexes, options) {
            var data;

            if (!options) options = {};

            if (!(indexes instanceof Indexes)) {
                indexes = new Indexes(indexes);
            }

            this.indexes = indexes;

            if (_.isArray(attrs)) {
                data = attrs;
                attrs = null;
            }
            else {
                options.parse = true;
            }

            this.data = new _DatumArray(data, indexes);

            Backbone.Model.prototype.constructor.call(this, attrs, options);
        },

        parse: function(resp, options) {
            this.data.reset(resp.values, options);
            delete resp.values;
            return resp;
        },

        isColumn: function() {
            return this.width() === 1;
        },

        isRow: function() {
            return !this.isColumn();
        },

        size: function() {
            if (this.isColumn()) {
                return this.data.length;
            }

            return 1;
        },

        width: function() {
            return this.indexes.length;
        }
    });

    // Collection of Series objects that serves as an internal container for
    // the Frame object.
    var _SeriesArray = Backbone.Collection.extend({
        constructor: function(attrs, indexes, options) {
            this.indexes = indexes;

            var _this = this;

            this.model = function(attrs, options) {
                Series.prototype.constructor.call(this, attrs, _this.indexes, options);
            };

            this.model.prototype = Series.prototype;

            Backbone.Collection.prototype.constructor.call(this, attrs, options);
        }
    });

    var Frame = base.Model.extend({
        constructor: function(attrs, indexes, options) {
            var data;

            if (!options) options = {};

            if (!(indexes instanceof Indexes)) {
                indexes = new Indexes(indexes);
            }

            this.indexes = indexes;

            if (_.isArray(attrs)) {
                data = attrs;
                attrs = null;
            }
            else {
                options.parse = true;
            }

            this.series = new _SeriesArray(data, indexes);

            base.Model.prototype.constructor.call(this, attrs, options);
        },

        parse: function(resp, options) {
            base.Model.prototype.parse.call(this, resp, options);

            this.indexes.reset(resp.keys, options);
            this.series.reset(resp.items, options);

            delete resp.keys;
            delete resp.items;

            return resp;
        },

        size: function() {
            return this.series.length;
        },

        width: function() {
            return this.indexes.length;
        },

        column: function(index) {
            var data = this.series.map(function(series) {
                return series.data.at(index);
            });

            return new Series(data, this.indexes.at(index));
        }
    });

    var FrameArray = base.Collection.extend({
        model: Frame,

        constructor: function(attrs, options) {
            this.indexes = new Indexes();

            this.on('reset', function(collection) {
                var model = collection.models[0];

                if (model) {
                    return this.indexes.reset(model.indexes.models);
                }
            });

            this.on('add', function(model, collection) {
                if (collection.length === 1) {
                    return this.indexes.reset(model.indexes.models);
                }
            });

            base.Collection.prototype.constructor.call(this, attrs, options);
        }
    });

    return {
        Datum: Datum,
        Frame: Frame,
        FrameArray: FrameArray,
        Index: Index,
        Indexes: Indexes,
        Series: Series
    };

});
