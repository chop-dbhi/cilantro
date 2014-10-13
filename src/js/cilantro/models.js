/* global define */

define([
    'underscore',
    './models/base',
    './models/concept',
    './models/context',
    './models/exporter',
    './models/field',
    './models/filters',
    './models/paginator',
    './models/query',
    './models/results',
    './models/stats',
    './models/value',
    './models/view'
], function(_) {

    var mods = [].slice.call(arguments, 1);

    return _.extend.apply(null, [{}].concat(mods));

});
