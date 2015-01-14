/* global define */

define([
    'underscore',
    './base'
], function(_, base) {

    var parseTitle = function(uri) {
        if (!uri) return 'Untitled';

        // If the title isn't there, do our best to get something meaningful
        // from the uri attribute.
        var fields;

        // Check if a trailing slash exists.
        if (uri.charAt(uri.length - 1) === '/') {
            fields = uri.substr(0, uri.length-1).split('/');
        }
        else {
            fields = uri.split('/');
        }

        // Use the segment of the path as the title.
        if (fields.length > 0) {
            return fields[fields.length - 1].toUpperCase();
        }

        // If we couldn't get the title from the uri then use the whole
        // uri property to try to give some context to the title.
        return 'Untitled ' + uri;
    };


    var ExporterModel = base.Model.extend({
        idAttribute: 'type'
    });


    var ExporterCollection = base.Collection.extend({
        model: ExporterModel,

        parse: function() {
            var models = [];

            _.each(this.links, function(uri, type) {
                if (type === 'self') return;

                models.push({
                    type: type,
                    uri: uri,
                    title: parseTitle(uri)
                });
            });

            return models;
        }
    });

    return {
        ExporterModel: ExporterModel,
        ExporterCollection: ExporterCollection
    };

});
