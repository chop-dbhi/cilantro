/* global define */

define([
    './base'
], function(base) {

    var Count = base.Model.extend({});

    var CountCollection = base.Collection.extend({
        model: Count
    });

    var Stats = base.Model.extend({
        constructor: function() {
            this.counts = new CountCollection();

            base.Model.prototype.constructor.apply(this, arguments);
        },

        parse: function(resp, options) {
            base.Model.prototype.parse.call(this, resp, options);

            if (this.links.counts) {
                var _this = this;

                this.counts.url = function() {
                    return _this.links.counts;
                };
                this.counts.fetch({reset: true});
            }
        }
    });

    return {
        Stats: Stats
    };

});
