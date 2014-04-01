/* global define */

define([
    'underscore',
    './models/base',
    './models/field',
    './models/concept',
    './models/context',
    './models/filters',
    './models/view',
    './models/paginator',
    './models/results',
    './models/exporter',
    './models/query',
    './models/value'
], function(_) {

    var mods = [].slice.call(arguments, 1);

    return _.extend.apply(null, [{}].concat(mods));

});
