/* global define */

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

        // Controls call this to put this itself in a waiting state
        wait: function() {
            if (this._waiting) return;

            this._waiting = true;

            var _this = this;

            var timer = setTimeout(function() {
                _this.trigger('error');
            }, c.config.get('timeouts.control'));

            // Clear the timeout on success or error
            this.on('beforeready error', function() {
                clearTimeout(timer);
            });
        },

        // Controls call this to mark themselves as ready. If the `wait`
        // flag is set, only trigger the ready state if control is not already
        // waiting.
        ready: function(wait) {
            if (wait && this._waiting) return;

            delete this._waiting;

            this.trigger('beforeready');
            this.trigger('ready');
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
            if (this._changing) return;

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
        // filter can be bound to this event and update itself as changes
        // occur.
        change: function() {
            this._changing = true;
            this.trigger('change', this, this.get());
            delete this._changing;
        },

        // Takes attributes and returns an error message if they are invalid
        // for this control.
        validate: function() {},

        // Takes attributes and returns a boolean to whether a value is set.
        isEmpty: function(attrs) {
            if (_.isUndefined(attrs.value) || _.isNull(attrs.value)) {
                return true;
            }

            if (_.isArray(attrs.value) && !attrs.value.length) {
                return true;
            }

            return false;
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
