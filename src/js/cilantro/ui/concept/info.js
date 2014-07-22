/* global define */

define([
    'jquery',
    'underscore',
    'marionette',
    '../core'
], function($, _, Marionette, c) {

    var ConceptInfo = Marionette.ItemView.extend({
        className: 'concept-info',

        template: 'concept/info',

        ui: {
            name: '.name',
            category: '.category',
            description: '.description',
            descriptionText: '.description .text',
            descriptionToggle: '.description .toggle'
        },

        events: {
            'click .category-link': 'onCategoryLinkClick',
            'click @ui.descriptionToggle': 'toggleDescription'
        },

        initialize: function() {
            // For window event handler
            _.bindAll(this, 'renderDescriptionToggle');

            // Assume fields have not been loaded yet. Re-render after fields
            // have been loaded.
            if (this.model.fields.length === 0) {
                this.listenToOnce(this.model.fields, 'reset', function() {
                    this.render();
                });
            }
        },

        onCategoryLinkClick: function(event) {
            var target = $(event.target);
            c.panels.concept.triggerSearch(target.text());
        },

        // If the concept does not have it's own description and contains only
        // one field, use the field's description.
        serializeData: function() {
            var data = this.model.toJSON();

            if (this.model.fields.length === 1) {
                var field = this.model.fields.at(0);
                if (!data.description) data.description = field.get('description');
                if (!data.unit) data.unit = field.get('unit');
            }

            return data;
        },

        onRender: function() {
            // Initial render
            _.defer(this.renderDescriptionToggle);

            // Hide toggle on resize
            $(window).on('resize', this.renderDescriptionToggle);
        },

        onClose: function() {
            $(window).off('resize', this.renderDescriptionToggle);
        },

        descriptionOverflows: function() {
            var scrollWidth = this.ui.descriptionText.prop('scrollWidth'),
                offsetWidth = this.ui.descriptionText.prop('offsetWidth');

            // Contents exceeds a "single line"
            return scrollWidth > offsetWidth;
        },

        renderDescriptionToggle: function() {
            // Restore state of class after test
            var hasClass = this.ui.description.hasClass('ellipsis');

            // Temporarily add class for calculation
            this.ui.description.addClass('ellipsis');

            if (this.descriptionOverflows()) {
                this.ui.descriptionToggle.show();
                this.ui.description.toggleClass('ellipsis', hasClass);
            }
            else {
                this.ui.descriptionToggle.hide();
                // Add it for the next resize
                this.ui.description.addClass('ellipsis');
            }
        },

        toggleDescription: function() {
            // Overflow hidden is enforced, toggle normally
            if (this.ui.description.hasClass('ellipsis')) {
                if (!this.descriptionOverflows()) return;
                this.ui.descriptionToggle.text('read less');
                this.ui.description.removeClass('ellipsis');
            }
            else {
                this.ui.descriptionToggle.text('read more');
                this.ui.description.addClass('ellipsis');
            }
        }
    });

    return {
        ConceptInfo: ConceptInfo
    };

});
