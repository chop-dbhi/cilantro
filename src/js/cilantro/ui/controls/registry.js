/* global define, require */

define([
    'underscore',
    'loglevel',
    '../../core',
    './date',
    './number',
    './search',
    './select',
    './infograph',
    './null',
    './text',
    './vocab'
], function(_, loglevel, c, date, number, search, select, infograph, nullSelector,
            text, vocab) {

    var defaultControls = {
        infograph: infograph.InfographControl,
        number: number.NumberControl,
        date: date.DateControl,
        search: search.SearchControl,
        singleSelectionList: select.SingleSelectionList,
        multiSelectionList: select.MultiSelectionList,
        nullSelector: nullSelector.NullSelector,
        text: text.TextControl,
        vocab: vocab.VocabControl
    };

    var customControls = {};

    // Controls can be registered as AMD modules which will be immediately
    // fetched to obtain the resulting compiled control function. This is
    // count of the number of pending AMD modules that have not been fetched.
    var pendingRemotes = 0;

    // Loads the remote control and adds it to the custom cache.
    var loadRemote = function(id, module) {
        pendingRemotes++;

        require([
            module
        ], function(func) {
            customControls[id] = func;
            pendingRemotes--;
        }, function(err) {
            loglevel.debug(err);
            pendingRemotes--;
        });
    };

    // Handles the case when the registered function is *not* a function.
    var _set = function(id, func) {
        switch (typeof func) {
            case 'function':
                customControls[id] = func;
                break;
            case 'string':
                loadRemote(id, func);
                break;
            default:
                throw new Error('control must be a function or AMD module');
        }
    };

    return {
        // Get the control function by id. Checks the custom cache and falls back
        // to the built-in cache.
        get: function(id) {
            return customControls[id] || defaultControls[id];
        },

        // Sets a control in cache.
        set: function(id, func) {
            if (typeof id === 'object') {
                _.each(id, function(func, key) {
                    _set(key, func);
                });
            }
            else {
                _set(id, func);
            }
        },

        // Returns a boolean denoting if all AMD-based controls have been loaded.
        ready: function() {
            return pendingRemotes === 0;
        },

        clear: function() {
            customControls = {};
        }
    };

});
