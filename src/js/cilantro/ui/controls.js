/* global define */

define([
    'underscore',
    './controls/base',
    './controls/range',
    './controls/date',
    './controls/number',
    './controls/search',
    './controls/infograph',
    './controls/registry',
    './controls/null',
    './controls/text',
    './controls/vocab'
], function(_) {

    // Modules to be mixed-in with exports
    var mods = Array.prototype.slice.call(arguments, 1);

    // Merge the mods into an empty object that will be exported
    return _.extend.apply(_, [{}].concat(mods));

});
