/* global define */

define(['jquery'], function($) {

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

        // Parse the href into a temporary anchor element
        var a = linkParser(href);

        // Parse existing params on URL
        var params = {},
            search = a.search.substr(1).split('&');

        // De-parametize URL
        for (var i = 0; i< search.length; i++) {
            var param = search[i].split('=');

            if (param[0]) {
                // Reverse what jQuery parametize logic
                params[param[0]] = decodeURIComponent(param[1].replace('+', ' '));
            }
        }

        // Update params hash with passed params
        $.extend(params, data);

        // Reset parameters on the href
        a.search = '?' + $.param(params);

        return a.href;
    };

    return {
        linkParser: linkParser,
        alterUrlParams: alterUrlParams
    };
});
