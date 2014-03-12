/* global define */
define(function() {

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
     * Augments/changes a URL's query parameters. Takes a URL and a variable
     * number of param pairs.
     */
    var alterUrlParams = function(href) {
        var args = Array.prototype.slice.call(arguments, 1);

        var a = linkParser(href),
            keys = [],
            params = {};

        var fields = a.search.substr(1).split('&');
        var temp, temp_fields, key, param;
        for (var i = 0; i < fields.length; i++) {
            temp = fields[i];
            temp_fields = temp.split('=');
            key = temp_fields[0];
            param = temp_fields[1];

            if (key) {
                params[key] = param;
                // Maintain the order of the keys
                keys.push(key);
            }
        }

        // Update the params hash with parameters
        for (i = 0; i < args.length; i++) {
            temp = args[i];

            if (i % 2 === 0) {
                param = temp;

                if (params[param] == null) {
                    keys.push(param);
                }
            }
            else {
                // We are at an odd number index so the previous index will
                // have set the param value we are using to index into the
                // params collection.
                params[param] = temp;
            }
        }

        // Rebuild search params
        var search = [];
        for (i = 0; i < keys.length; i++) {
            key = keys[i];

            if ((param = params[key]) == null) {
                param = '';
            }
            search.push('' + key + '=' + param);
        }

        a.search = "?" + (search.join('&'));
        return a.href;
    };

    return {
        linkParser: linkParser,
        alterUrlParams: alterUrlParams
    };
});
