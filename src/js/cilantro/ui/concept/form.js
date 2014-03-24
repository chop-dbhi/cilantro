/* global define */

define([
    'jquery',
    'underscore',
    'marionette',
    '../../core',
    '../field',
    '../charts',
    './info'
], function($, _, Marionette, c, field, charts, info) {

    var ConceptForm = Marionette.Layout.extend({
        className: 'concept-form',

        template: 'concept/form',

        options: {
            condense: false,
            // Minimum number of concept fields to show the "jump-to" links
            linksMinFields: 2
        },

        events: {
            'click .footer [data-toggle=apply]': 'applyFilter',
            'click .footer [data-toggle=update]': 'applyFilter',
            'click .footer [data-toggle=remove]': 'removeFilter',
            'click .footer [data-toggle=revert]': 'revertFilter',
            'click [data-target=links] a': 'jumpToField'
        },

        ui: {
            state: '.footer .state',
            apply: '.footer [data-toggle=apply]',
            update: '.footer [data-toggle=update]',
            remove: '.footer [data-toggle=remove]'
        },

        regions: {
            info: '.info-region',
            links: '.links-region',
            fields: '.fields-region'
        },

        regionViews: {
            info: info.ConceptInfo,
            links: field.FieldLinkCollection,
            fields: field.FieldFormCollection
        },

        contextEvents: {
            apply: 'renderApplied',
            remove: 'renderNew',
            clear: 'renderNew',
            change: 'renderChange',
            invalid: 'renderInvalid'
        },

        constructor: function(options) {
            options = options || {};

            this.data = {};

            if (!(this.data.context = options.context)) {
                throw new Error('context model required');
            }

            if (!options.model) {
                throw new Error('concept model required');
            }

            // Define or get the local context node
            this.context = this.data.context.manager.define({
                concept: options.model.id
            }, {type: 'branch'});

            Marionette.Layout.prototype.constructor.call(this, options);
        },

        delegateEvents: function() {
            Marionette.Layout.prototype.delegateEvents.apply(this, arguments);
            this.delegateContextEvents();
        },

        undelegateEvents: function() {
            Marionette.Layout.prototype.undelegateEvents.apply(this, arguments);
            this.undelegateContextEvents();
        },

        // Listen to context events
        delegateContextEvents: function() {
            var event, method;

            for (event in this.contextEvents) {
                method = this.contextEvents[event];
                this.listenTo(this.context, event, this[method]);
            }
        },

        // Stop listening to context events
        undelegateContextEvents: function() {
            var event, method;

            for (event in this.contextEvents) {
                method = this.contextEvents[event];
                this.stopListening(this.context, event, this[method]);
            }
        },

        onRender: function() {
            var info = new this.regionViews.info({
                model: this.model
            });

            var fields = new field.FieldFormCollection(_.defaults({
                context: this.context,
                collection: this.model.fields
            }, this.options));

            this.info.show(info);
            this.fields.show(fields);

            this.renderChange();

            var minFields = this.options.linksMinFields;

            // Explicitly marked as false which implies disabling this view
            if (minFields === false) return;

            // Assume the fields have not loaded yet, render when done
            if (this.model.fields.length === 0) {
                this.listenToOnce(this.model.fields, 'reset', function(collection) {
                    if (collection.length >= minFields) this._renderLinks();
                });
            }
            else if (this.model.fields.length > this.options.linksMinFields) {
                this._renderLinks();
            }
        },

        _renderLinks: function() {
            var links = new this.regionViews.links({
                concept: this.model,
                collection: this.model.fields
            });

            this.links.show(links);
        },

        // Changes the state of the footer elements given a message, class
        // name and whether the buttons should be enabled.
        _renderFooter: function(message, className, enabled) {
            // Disable previous error state
            this.ui.state.removeClass('alert-error', 'alert-warning');

            if (message) {
                this.ui.state.show().html(message);
            } else {
                this.ui.state.hide().html('');
            }

            if (className) {
                this.ui.state.addClass(className);
            }

            this.ui.apply.prop('disabled', !enabled);
            this.ui.update.prop('disabled', !enabled);
        },

        renderChange: function() {
            if (this.context.isNew()) {
                this.renderNew();
            } else {
                this.renderApplied();
            }
        },

        // Renders an error message if the filter is deemed invalid
        renderInvalid: function(model, error) {
            var className = 'alert-error';
            var message = '<strong>Uh oh.</strong> Cannot apply filter: ' + error;

            // Add the ability to revert the context
            if (!this.context.isNew()) {
                message += ' <a data-toggle=revert class=revert href=#>Revert</a>';
            }

            this._renderFooter(message, className, false);
        },

        renderApplied: function() {
            this.ui.apply.hide();
            this.ui.update.show();
            this.ui.remove.show();

            var enabled, className, message;

            if ((enabled = this.context.isDirty())) {
                className = 'alert-warning';
                message = '<strong>Heads up!</strong> The filter has been changed. ' +
                          '<a data-toggle=revert class=revert href=#>Revert</a>';
            }

            // Strictly check if this context is valid which requires at least
            // one condition to be present
            enabled = enabled && this.context.isValid();
            this._renderFooter(message, className, enabled);
        },

        renderNew: function() {
            this.ui.apply.show();
            this.ui.update.hide();
            this.ui.remove.hide();
            // Strictly check if this context is valid which requires at least
            // one condition to be present
            this._renderFooter(null, null, this.context.isValid());
        },

        // Saves the current state of the context which enables it to be
        // synced with the server.
        applyFilter: function(event) {
            if (event) event.preventDefault();
            this.context.apply();
        },

        // Remove the filter
        removeFilter: function(event) {
            if (event) event.preventDefault();
            this.context.remove();
        },

        // Revert the filter
        revertFilter: function(event) {
            if (event) event.preventDefault();
            this.context.revert();
        },

        jumpToField: function(event) {
            event.preventDefault();

            // Get the scroll position of the target element.
            // The additional pixels provides some spacing from the top,
            // so is not flush with the viewport.
            var scrollTop = $(event.target.hash).offset().top - 20;
            $('html,body').animate({scrollTop: scrollTop});
        },
    });

    return {
        ConceptForm: ConceptForm
    };

});
