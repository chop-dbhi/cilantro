/* global define */

define([
    '../core',
    './templates',
    './controls',
    './dom',

    // Load mutating plugins
    'bootstrap',
    'plugins/bootstrap-datepicker',
    'plugins/jquery-ui',
    'plugins/jquery-easing',
    'plugins/jquery-panels',
    'plugins/jquery-scroller'
], function(c, templates, controls, dom) {

    // Attach public APIs
    c.templates = templates;
    c.controls = controls;
    c.dom = dom;

    // Return the cilantro object so ui/* modules can load this directly
    return c;

});
