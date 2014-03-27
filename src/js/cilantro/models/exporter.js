/* global define */

define([
    'underscore',
    './base'
], function(_, base) {

    var parseTitle = function(attrs) {
        if (!attrs.href) return 'Untitled';

        // If the title isn't there, do our best to get something meaningful
        // from the href attribute.
        var href = attrs.href, fields;

        // Check if a trailing slash exists
        if (href.charAt(href.length - 1) === '/') {
            fields = href.substr(0, href.length-1).split('/');
        }
        else {
            fields = href.split('/');
        }

        // Use the segment of the path as the title
        if (fields.length > 0) {
            return fields[fields.length - 1].toUpperCase();
        }

        // If we couldn't get the title from the href then use the whole
        // href property to try to give some context to the title.
        return 'Untitled ' + href;
    };


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
                    attrs = _.extend({type: type}, attrs);
                    if (!attrs.title) attrs.title = parseTitle(attrs);
                    models.push(attrs);
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
