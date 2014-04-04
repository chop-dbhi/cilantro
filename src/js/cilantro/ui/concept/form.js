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
            'click [data-target=links] a': 'jumpToField'
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

        constructor: function(options) {
            options = options || {};

            if (!options.model) {
                throw new Error('concept model required');
            }

            Marionette.Layout.prototype.constructor.call(this, options);
        },

        initialize: function() {
            this.data = {};

            if (!(this.data.context = this.options.context)) {
                throw new Error('context required');
            }
        },

        onRender: function() {
            var info = new this.regionViews.info({
                model: this.model
            });

            var fields = new field.FieldFormCollection(_.defaults({
                context: this.data.context,
                concept: this.model,
                collection: this.model.fields
            }, this.options));

            this.info.show(info);
            this.fields.show(fields);

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
