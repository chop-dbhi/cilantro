/* global define */

// Return all the view and general UI-based components
define([
    'underscore',
    './ui/core',
    './ui/accordian',
    './ui/base',
    './ui/button',
    './ui/charts',
    './ui/concept',
    './ui/context',
    './ui/controls',
    './ui/exporter',
    './ui/field',
    './ui/notify',
    './ui/paginator',
    './ui/query',
    './ui/tables',
    './ui/workflows'
], function(_) {

    // Note, the ui/core module is intentially left out
    var mods = [].slice.call(arguments, 2);

    return _.extend.apply(null, [{}].concat(mods));

});
