/* global define */

// Return all the view and general UI-based components
define([
    'underscore',
    './ui/core',
    './ui/base',
    './ui/button',
    './ui/concept',
    './ui/field',
    './ui/charts',
    './ui/context',
    './ui/controls',
    './ui/exporter',
    './ui/tables',
    './ui/query',
    './ui/workflows',
    './ui/paginator',
    './ui/notify'
], function(_) {

    // Note, the ui/core module is intentially left out
    var mods = [].slice.call(arguments, 2);

    return _.extend.apply(null, [{}].concat(mods));

});
