/* global define */

define([
    'underscore',
    './concept/info',
    './concept/search',
    './concept/index',
    './concept/panel',
    './concept/form',
    './concept/workspace',
    './concept/columns'
], function(_) {

    var mods = [].slice.call(arguments, 1);

    return _.extend.apply(_, [{}].concat(mods));

});
