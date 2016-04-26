/* global define */

define([
    'jquery',
    'underscore'
], function($, _) {

    /*
     * Utility method for parsing links. See:
     *      http://stackoverflow.com/a/6644749/407954
     *      https://developer.mozilla.org/en-US/docs/Web/API/window.location
     */
    var linkParser = function(href) {
        var a = document.createElement('a');
        a.href = href;
        return a;
    };

    /*
     * Augments/changes a URL's query parameters. Takes a URL and object
     * of URL params.
     */
    var alterUrlParams = function(href, data) {
        if (!data) return href;

        // Parse the href into a temporary anchor element.
        var a = linkParser(href);

        // Parse existing params on URL.
        var params = {},
            search = a.search.substr(1).split('&');

        // De-parametize URL.
        for (var i = 0; i< search.length; i++) {
            var param = search[i].split('=');

            if (param[0]) {
                // Reverse what jQuery parametize logic.
                params[param[0]] = decodeURIComponent(param[1].replace('+', ' '));
            }
        }

        // Update params hash with passed params
        $.extend(params, data);

        // Reset parameters on the href
        a.search = '?' + $.param(params);

        return a.href;
    };

    /*
     * Extracts the URI from the supplied portion of a Link header field. More
     * information on the format of this element can be found in the RFC here:
     *
     *      https://tools.ietf.org/html/rfc5988#page-6
     */
    var _parseUriReference = function(str) {
        return str.replace(/[<>]/g, '');
    };

    /*
     * Extracts the link-param elements of a Link Header field. This information
     * is returned as key/value pairs where the key is the link-param name
     * and the value is the quoted value from the link-param element. More
     * info on link-param structure can be found in the RFC here:
     *
     *      https://tools.ietf.org/html/rfc5988#page-6
     */
    var _parseParameters = function(parameterStrings) {
        var parameters = {};

        _.each(parameterStrings, function(parameterStr) {
            var fields = parameterStr.trim().split('='),
                fieldParameter;

            if (fields.length === 2) {
                fieldParameter = {};
                fieldParameter[fields[0]] = fields[1].replace(/"/g, '');

                _.extend(parameters, fieldParameter);
            }
        });

        return parameters;
    };

    /*
     * Extracts the individual links based on the header field structure
     * outlined in the RFC here:
     *
     *      https://tools.ietf.org/html/rfc5988#page-6
     *
     * The returned link collection will be a collection where the keys are
     * the rel name of the Link and the value is an object containing all the
     * relevant data that could be extracted from each Link object in from the
     * supplied string which, at a minimum, will be the link-value.
     *
     * We make some assumptions here that are a bit more strict than the RFC.
     * For one, we assume that the relation type is always specified and that
     * the relation type is a name indicating the type, not an absolute URI
     * as they are allowed to be in the RFC. Additionally, we consider the
     * URI-References themselves to be absolute URIs even though the RFC allows
     * them to be relative URIs where the root URI is specified in the
     * relation type.
     */
    var _getNamedLinks = function(linkStr) {
        if (!linkStr) return {};

        var linkStrings = linkStr.split(','),
            links = {},
            linkFields,
            uri,
            parameters,
            rel;

        for (var i = 0; i < linkStrings.length; i++) {
            linkFields = linkStrings[i].split(';');

            // Per the RFC, the URI-Reference must be the first field or this
            // is invalid.
            uri = _parseUriReference($.trim(linkFields[0]));
            parameters = _parseParameters(linkFields.slice(1));

            // If a relation type was not specified in the parameters then
            // we consider this link-value invalid and we can disregard it.
            if (!('rel' in parameters)) continue;

            // Save a reference to the relation type then delete it from the
            // parameters as we will use the parameters(minus the relation type)
            // to polulate the links value for this relation type key.
            rel = parameters.rel;
            delete parameters.rel;

            // If this relation type was already specified in the links
            // collection, subsequent occurrences are ignored. This conforms to
            // the behavior specified in the RFC at the top of section 5.3.
            if (rel in links) continue;

            // Add the uri to the other parameters we read and store them all
            // along with the relation type in the links collection.
            links[rel] = uri;
        }

        return links;
    };

    /*
     * Utility method for extracting link information from the Link and
     * Link-Template header sections. The Link-Templates related links that
     * are returned are not mased on any specific model but are instead the
     * templates themselves without any variable replacement.
     */
    var getLinks = function(xhr) {
        // If the response headers are not populated because the request has
        // not returned then don't bother with any processing since we won't
        // be able to access the header info.
        if (!xhr.getResponseHeader) return {};

        var links = xhr.getResponseHeader('Link');
        links = _getNamedLinks(links);

        return links;
    };

    /*
     * Utility method for extracting raw link information from the
     * Link-Template header section. The Link-Templates related links that are
     * returned are not based on any specific model but are instead the
     * templates themselves without any variable replacement.
     */
    var getLinkTemplates = function(xhr) {
        // If the response headers are not populated because the request has
        // not returned then don't bother with any processing since we won't
        // be able to access the header info.
        if (!xhr.getResponseHeader) return {};

        var linkTemplates = xhr.getResponseHeader('Link-Template');
        linkTemplates = _getNamedLinks(linkTemplates);

        return linkTemplates;
    };

    var _substituteLinkVariable = function(uri, attrs, variable) {
        // Strip the curly braces from the url variable to get the naive
        // property value.
        var property = variable.replace(/[\{\}]/g, '');

        // In the best case, the variable maps directly to a property value. If
        // that is true then perform the replacement and call it a day.
        // Otherwise, start investigating the possibile nested property cases.
        if (attrs[property] !== undefined) {
            return uri.replace(variable, attrs[property]);
        }

        return uri;
    };

    var getLinksFromTemplates = function(model, templates) {
        var links = $.extend(true, {}, templates),
            match,
            matches = [],
            regex = /(\{\w+\})/g;

        _.each(links, function(uri, key) {
            matches = [];

            // Find all the variables in the uri that we will need to replace
            // with the appropriate properties from the model later on to
            // generate a specific link for the model itself.
            while ((match = regex.exec(uri))) {
                uri = _substituteLinkVariable(uri, model, match[1]);
            }

            links[key] = uri;
        });

        return links;
    };

    return {
        alterUrlParams: alterUrlParams,
        getLinks: getLinks,
        getLinkTemplates: getLinkTemplates,
        getLinksFromTemplates: getLinksFromTemplates,
        linkParser: linkParser
    };
});
