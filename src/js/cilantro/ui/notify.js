/* global define */

/*
 * The cilantro/ui/notify module provides an interface for creating notifications
 * for display to users.
 */

define([
    'underscore',
    'backbone',
    'marionette'
], function(_, Backbone, Marionette) {

    var NotificationModel = Backbone.Model.extend({
        defaults: {
            level: 'info',
            timeout: 4000,
            dismissable: true,
            header: null,
            message: ''
        }
    });

    var Notification = Marionette.ItemView.extend({
        className: 'alert',

        template: 'notification',

        ui: {
            dismiss: '[data-dismiss]',
            header: 'h4',
            message: 'div'
        },

        events: {
            'click [data-dismiss]': 'dismiss',
            'mouseover': 'hold',
            'mouseout': 'release'
        },

        dismiss: function() {
            // Clear the timer if set
            clearTimeout(this._dismissTimer);
        },

        hold: function() {
            if (!this._startTime) return;

            clearTimeout(this._dismissTimer);
            // In case the fade out has started
            this.$el.stop().show();
        },

        release: function() {
            if (!this._startTime) return;

            // Determine the time left relative to the start time and
            // release after one second in case the mouse runs away
            var end = this._startTime + this.model.get('timeout'),
                timeout = Math.max(end - (new Date()).getTime(), 1000);

            var _this = this;
            this._dismissTimer = setTimeout(function() {
                _this.$el.fadeOut();
            }, timeout);
        },

        onRender: function() {
            // Add class based on the level.
            this.$el.addClass('alert-' + this.model.get('level'));

            // Toggle header if falsy
            this.ui.header.toggle(!!this.model.get('header'));

            // Toggle dismiss button
            this.ui.dismiss.toggle(this.model.get('dismissable'));

            // Add a timeout for time-based notifications
            var timeout = this.model.get('timeout');

            if (timeout) {
                this._startTime = (new Date()).getTime();
                this.release();
            }
        }
    });

    var Notifications = Marionette.CollectionView.extend({
        className: 'notifications',

        itemView: Notification,

        constructor: function(options) {
            options = options || {};

            if (!options.collection) {
                options.collection = new Backbone.Collection();
            }

            Marionette.CollectionView.prototype.constructor.call(this, options);

            _.bindAll(this, 'notify');
        },

        notify: function(attrs) {
            // Handle shorthand notation with only a message
            if (typeof attrs === 'string') {
                attrs = {message: attrs};
            }

            // Manually construct to prevent server-side requests
            var model = new NotificationModel(attrs);
            this.collection.add(model);
            return this.children.findByModel(model);
        }
    });

    return {
        Notifications: Notifications,
        Notification: Notification
    };

});
