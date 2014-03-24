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
            description: '.description'
        },

        events: {
            'click .category-link': 'onCategoryLinkClick'
        },

        initialize: function() {
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

            if (!data.description && this.model.fields.length === 1) {
                data.description = this.model.fields.at(0).get('description');
            }

            return data;
        }

    });

    return {
        ConceptInfo: ConceptInfo
    };

});
