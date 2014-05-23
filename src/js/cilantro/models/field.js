/* global define */

define([
    'underscore',
    'backbone',
    '../core',
    './base',
    './stats'
], function(_, Backbone, c, base, stats) {

    var getLogicalType = function(attrs) {
        // Takes precedence since it is specified explicitly.
        var type = c.config.get('fields.instances.' + attrs.id + '.type');

        if (type) return type;

        // Fallback to the upstream type defined on the field.
        if (attrs.type) {
            return attrs.type;
        }

        // Infer/select a logical type based on the field's properties.
        type = attrs.simple_type;   // jshint ignore:line

        if (attrs.enumerable || type === 'boolean') {
            return 'choice';
        }

        return type;
    };

    var FieldModel = base.Model.extend({
        constructor: function() {
            base.Model.prototype.constructor.apply(this, arguments);

            var _this = this;
            if (this.links.stats) {
                this.stats = new stats.StatCollection();
                this.stats.url = function() {
                    return _this.links.stats;
                };
            }
        },

        parse: function() {
            this._cache = {};

            var attrs = base.Model.prototype.parse.apply(this, arguments);
            attrs.type = getLogicalType(attrs);

            return attrs;
        },

        distribution: function(handler, cache) {
            if (cache !== false) cache = true;

            if (this.links.distribution === undefined) {
                handler();
                return;
            }

            if (cache && (this._cache.distribution !== undefined)) {
                handler(this._cache.distribution);
            }
            else {
                var _this = this;
                Backbone.ajax({
                    url: this.links.distribution,
                    dataType: 'json',
                    success: function(resp) {
                        if (cache) {
                            _this._cache.distribution = resp;
                        }
                        return handler(resp);
                    }
                });
            }
        },

        values: function(params, handler, cache) {
            if (cache !== false) cache = true;

            // Shift arguments if params is not supplied.
            if (typeof params === 'function') {
                handler = params;
                cache = handler;
                params = {};
            }
            // Do not cache query-based lookups.
            else if (params) {
                cache = false;
                // Support previous behavior of passing a query string.
                if (typeof params === 'string') {
                    params = {
                        query: params
                    };
                }
            }

            // Field does not support values, call the handler without
            // a response.
            if (!this.links.values) {
                handler();
                return;
            }

            var deferred = Backbone.$.Deferred();

            // Register handler to facilitate previous behavior.
            if (handler) {
                deferred.done(handler);
            }

            // Use cache if available.
            if (cache && (this._cache.values !== undefined)) {
                deferred.resolve(this._cache.values);
            }
            else {
                var _this = this;

                Backbone.ajax({
                    url: this.links.values,
                    data: params,
                    dataType: 'json',
                    success: function(resp) {
                        if (cache) {
                            _this._cache.values = resp;
                        }
                        deferred.resolve(resp);
                    },
                    error: function() {
                        deferred.reject();
                    }
                });
            }

            return deferred.promise();
        }
    });

    var FieldCollection = base.Collection.extend({
        model: FieldModel,

        search: function(query, handler) {
            Backbone.ajax({
                url: _.result(this, 'url'),
                data: { query: query },
                dataType: 'json',
                success: function(resp) {
                    handler(resp);
                }
            });
        }
    });

    return {
        FieldModel: FieldModel,
        FieldCollection: FieldCollection
    };

});
