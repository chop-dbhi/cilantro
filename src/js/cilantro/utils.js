/* global define,console */

define([
    'jquery',
    './utils/numbers',
    './utils/url',
    './utils/version'
], function($) {

    // Modules to be mixed-in with exports
    var mods = Array.prototype.slice.call(arguments, 1);

    var setCookie = function(name, value) {
        document.cookie = name + '=' + window.escape(value) + '; path=/';
    };

    var getCookie = function(cname) {
        // Code from: http://www.w3schools.com/js/js_cookies.asp
        var name = cname + '=';
        var ca = document.cookie.split(';');

        for(var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
    };

    // Convenience method for getting a value using the dot-notion for
    // accessing nested structures.
    var getDotProp = function(obj, key, def) {
        var toks = key.split('.');

        for (var i = 0; i < toks.length; i++) {
            obj = obj[toks[i]];

            if (obj === undefined) {
                return def;
            }
        }
        // Final value of obj is returned
        if (typeof obj === 'function') {
            return obj.apply();
        }
        else {
            return obj;
        }
    };

    // Convenience method for setting a value using the dot-notion for
    // accessing nested structures.
    var setDotProp = function(obj, key, value) {
        if (typeof key === 'object') {
            // Second argument is a boolean to whether or not to replace
            // the options
            if (value === true) {
                return $.extend(true, {}, key);
            }
            return $.extend(true, obj, key);
        }

        var toks = key.split('.'),
            last = toks.pop();

        for (var t, i = 0; i < toks.length; i++) {
            t = toks[i];

            if (obj[t] === undefined) {
                obj[t] = {};
            }
            obj = obj[t];
        }
        obj[last] = value;
    };

    var pprint = function(obj) {
        console.log(JSON.stringify(obj, null, 4));
    };

    mods.unshift({
        pprint: pprint,
        getDotProp: getDotProp,
        getCookie: getCookie,
        setCookie: setCookie,
        setDotProp: setDotProp
    });

    return $.extend.apply(null, mods);
});
