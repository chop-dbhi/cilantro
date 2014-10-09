/* global define */

define([
    'underscore',
    'backbone',
    '../structs',
    '../constants'
], function(_, Backbone, structs, constants) {

    // Represents a value as defined in a query condition. For a given list of
    // values, a value can not be specified twice, so it is treated
    // as the `id`.
    var Value = Backbone.Model.extend({
        idAttribute: 'label',

        defaults: {
            valid: null,
            pending: false
        },

        // Disable. Instances are created via the `Values` collection.
        fetch: function() {},

        // The upstream use of this will be to represent an array of values.
        // If the label is not necessary, the `flat=true` can be set to return
        // only the value.
        toJSON: function(options) {
            if (options && options.flat) {
                return this.pluck('value');
            }

            return this.pick('value', 'label');
        },

        // Override to remove itself from the collection bypassing any
        // server-side call.
        destroy: function(options) {
            this.trigger('destroy', this, this.collection, options);
        }
    });


    // Collection of selected values, fetch is disabled, create performs no
    // server-side request.
    var Values = Backbone.Collection.extend({
        model: Value,

        options: {
            check: true
        },

        initialize: function(models, options) {
            options = _.extend({}, this.options, options || {});

            // If values must be checked, bind to the add event
            if (options.check) {
                this.on('add reset', _.debounce(this.check, constants.INPUT_DELAY));
            }
        },

        fetch: function() {},

        create: function(model, options) {
            this.add(model, options);
        },

        check: function() {
            var models = this.where({valid: null, pending: false});

            // Nothing to check
            if (!models.length || !this.url) return;

            // Mark the models as pending to prevent redundant validation.
            _.each(models, function(model) {
                model.set('pending', true, {silent: true});
            });
            this.trigger('change');

            var _this = this;

            Backbone.ajax({
                url: this.url(),
                type: 'POST',
                data: JSON.stringify(models),
                contentType: 'application/json',
                success: function(resp) {
                    // Don't add since the value could have been removed
                    // in the meantime. Don't remove since this may only
                    // represent a subset of values in the collection.
                    _this.set(resp, {add: false, remove: false, silent: true});
                },

                complete: function() {
                    // Mark the models as not pending when the request
                    // has completed regardless if the request succeeded
                    // or failed.
                    _.each(models, function(model) {
                        model.set('pending', false, {silent: true});
                    });
                    _this.trigger('change');
                }
            });
        }
    });


    return {
        Value: Value,
        Values: Values
    };

});
