/* global define */

define([
    'underscore',
    './core'
], function(_, c) {

    var resolveFormOptions = function(model, namespace) {
        var viewClass, viewClassModule, viewOptions = [{}];

        // Instance options
        var instanceOptions = c.config.get(namespace + '.instances.' +
                                           model.id + '.form');

        // Constructor
        if (_.isFunction(instanceOptions)) {
            viewClass = instanceOptions;
        }
        // Module name for async fetching
        else if (_.isString(instanceOptions)) {
            viewClassModule = instanceOptions;
        }
        // Options for default view class
        else if (_.isObject(instanceOptions)) {
            viewOptions.push(instanceOptions);
        }

        // Type options
        var typeOptions = c.config.get(namespace + '.types.' +
                                       model.get('type') + '.form');

        // Constructor
        if (!viewClass && _.isFunction(typeOptions)) {
            viewClass = typeOptions;
        }
        // Module name for async fetching
        else if (!viewClassModule && _.isString(typeOptions)) {
            viewClassModule = typeOptions;
        }
        else {
            viewOptions.push(typeOptions);
        }

        // Default options
        var defaultOptions = c.config.get(namespace + '.defaults.form');

        // Constructor
        if (!viewClass && _.isFunction(defaultOptions)) {
            viewClass = defaultOptions;
        }
        // Module name for async fetching
        else if (!viewClassModule && _.isString(defaultOptions)) {
            viewClassModule = defaultOptions;
        }
        else {
            viewOptions.push(defaultOptions);
        }

        // Compose options in order of precedence
        viewOptions = _.defaults.apply(null, viewOptions);

        return {
            view: viewClass,
            module: viewClassModule,
            options: viewOptions
        };
    };

    return {
        resolveFormOptions: resolveFormOptions
    };

});
