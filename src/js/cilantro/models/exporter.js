/* global define */

define([
    'underscore',
    '../core',
    './base'
], function(_, c, base) {

    var ExporterModel = base.Model.extend({
        idAttribute: 'type'
    });


    var ExporterCollection = base.Collection.extend({
        model: ExporterModel,

        parse: function(resp) {
            var models = [];

            _.each(resp._links, function(attrs, type) {
                // Ignore the exporter endpoint itself
                if (type !== 'self') {
                    models.push(_.extend({type: type}, attrs));
                }
            });

            return models;
        }
    });

    return {
        ExporterModel: ExporterModel,
        ExporterCollection: ExporterCollection
    };

});
