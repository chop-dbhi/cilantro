/* global define */

define([
    'underscore',
    './pages/query',
    './pages/results',
    './pages/workspace'
], function(_) {

    var mods = [].slice.call(arguments, 1);

    return _.extend.apply(null, [{}].concat(mods));

});
