/* global define, console */

define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    '../../core'
], function($, _, Backbone, Marionette, c) {

    var noop = function() {};

    var ControlViewMixin = {
        className: 'control',

        attrNames: ['concept', 'field', 'operator', 'value'],

        attrGetters: {
            concept: 'getConcept',
            field: 'getField',
            operator: 'getOperator',
            value: 'getValue'
        },

        attrSetters: {
            concept: 'setConcept',
            field: 'setField',
            operator: 'setOperator',
            value: 'setValue'
        },

        // Get the value from this control for the attr key. This
        // attempts to call the associated method in attrGetters.
        _get: function(key, options) {
            var method, func;

            if (!(method = this.attrGetters[key])) return;

            if ((func = this[method])) {
                return func.call(this, options);
            }

            throw new Error('Getter declared, but not defined for ' + key);
        },

        // Set the value on this control for the attr key. This
        // attempts to call the associated method in attrSetters.
        _set: function(key, value, options) {
            var method, func;

            if (!(method = this.attrSetters[key])) return;

            if ((func = this[method])) {
                return func.call(this, value, options);
            }

            throw new Error('Setter declared, but not defined for ' + key);
        },

        // Backwards compatibility
        bindContext: function() {
            var warn = console.warn || console.log;
            warn('bindContext is deprecated and no longer required for controls');
        },

        // Controls call this to initialize a deferred which enables callers
        // to call `when` to receive a promise that will be resolved or
        // rejected once the control finishes it's async actions.
        wait: function() {
            if (!this._deferred) {
                this._deferred = $.Deferred();

                var _this = this;

                // Times if the control does not resolve/reject itself after
                // some time. This is to prevent async operations from hanging
                // too long.
                var timer = setTimeout(function() {
                    _this._deferred.reject();
                }, c.config.get('timeouts.control'));

                // Clear the timeout once the deferred has been resolved
                // or rejected.
                this._deferred.always(function() {
                    clearTimeout(timer);
                });
            }
        },

        // Controls call this to mark themselves as ready
        ready: function() {
            if (!this._deferred) {
                this._deferred = $.Deferred();
            }
            this._deferred.resolve();
        },

        // Returns a promise to callers that will be resolved when the control
        // is ready.
        when: function(done, fail) {
            // If deferred is not bound, it is assumed the control does not
            // have any async task to perform so it is immediately resolved.
            if (!this._deferred) this.ready();

            // Shortcut for binding handlers
            var promise = this._deferred.promise();
            if (done) promise = promise.done(done);
            if (fail) promise = promise.fail(fail);

            return promise;
        },

        // Return attributes for each getter defined for this control.
        // If a specific key is provided, only return the value for that key.
        get: function(key, options) {
            // Shift arguments
            if (_.isObject(key)) {
                options = key;
                key = null;
            }

            // Single key, e.g. get('value')
            if (key) return this._get(key, options);

            var attrs = {};

            // If the getter returns an undefined result, this implies
            // the method is not implemented.
            for (var value, i = 0; i < this.attrNames.length; i++) {
                key = this.attrNames[i];

                if ((value = this._get(key, options)) !== undefined) {
                    attrs[key] = value;
                }
            }

            return attrs;
        },

        // Sets a value on the control for the attr key or object. If an model
        // is passed, it's toJSON method is called to returned the underlying
        // attributes of the model.
        set: function(key, value, options) {
            var attrs;

            // Shift arguments
            if (_.isObject(key)) {
                if (key instanceof Backbone.Model) {
                    attrs = key.toJSON();
                } else {
                    attrs = key;
                }
                options = value;
            } else {
                (attrs = {})[key] = value;
            }

            for (key in attrs) {
                if ((value = attrs[key]) !== undefined) {
                    this._set(key, value, options);
                }
            }
        },

        clear: function(key, options) {
            // Shift arguments
            if (_.isObject(key)) {
                options = key;
                key = null;
            }

            var attrs = {};

            if (key) {
                attrs[key] = undefined;
            } else {
                for (var i = 0; i < this.attrNames.length; i++) {
                    key = this.attrNames[i];
                    attrs[key] = undefined;
                }
            }

            this._set(attrs, options);
        },

        // Triggered any time the control contents have changed. Upstream, the
        // context can be bound to this event and update itself as changes
        // occur.
        change: function() {
            this._changing = true;
            this.trigger('change', this, this.get());
            this._changing = undefined;
        },

        // Placeholder no-op getter/setter functions for each attribute
        getConcept: noop,
        getField: noop,
        getOperator: noop,
        getValue: noop,

        setConcept: noop,
        setField: noop,
        setOperator: noop,
        setValue: noop
    };

    // View classes for each Marionette view type with the control attributes
    // mixed-in
    var ControlView = Marionette.View.extend({}),
        ControlItemView = Marionette.ItemView.extend({}),
        ControlCollectionView = Marionette.CollectionView.extend({}),
        ControlCompositeView = Marionette.CompositeView.extend({}),
        ControlLayout = Marionette.Layout.extend({});

    _.defaults(ControlView.prototype, ControlViewMixin);
    _.defaults(ControlItemView.prototype, ControlViewMixin);
    _.defaults(ControlCollectionView.prototype, ControlViewMixin);
    _.defaults(ControlCompositeView.prototype, ControlViewMixin);
    _.defaults(ControlLayout.prototype, ControlViewMixin);

    return {
        ControlViewMixin: ControlViewMixin,
        ControlView: ControlView,
        ControlItemView: ControlItemView,
        ControlCollectionView: ControlCollectionView,
        ControlCompositeView: ControlCompositeView,
        ControlLayout: ControlLayout,
        Control: ControlLayout // backwards compatibility
    };

});
