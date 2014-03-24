/* global define */

define([
    'underscore',
    'marionette',
    './index',
    './search'
], function(_, Marionette, index, search) {

    var ConceptPanel = Marionette.Layout.extend({
        id: 'concept-panel',

        className: 'panel panel-left closed',

        template: 'concept/panel',

        // Two primary regions for the concept panel including the search
        // and the index (listing) of concepts
        regions: {
            search: '.search-region',
            index: '.index-region'
        },

        regionViews: {
            search: search.ConceptSearch,
            index: index.ConceptIndex
        },

        onRender: function() {
            // Initialize panel plugin to set default state
            this.$el.panel();

            // Pass the collection of concepts to be rendered in the index
            var indexRegion = new this.regionViews.index({
                collection: this.collection
            });

            // Pass the collection concepts to be searched and a handler
            // that updates the index based on the matched results.
            var searchRegion = new this.regionViews.search({
                collection: this.collection,
                handler: function(query, resp) {
                    indexRegion.filter(query, resp);
                }
            });

            this.search.show(searchRegion);
            this.index.show(indexRegion);
        },

        // Enables triggering a search directly
        triggerSearch: function(query) {
            this.search.currentView.trigger('search', query);
        },

        openPanel: function(options) {
            this.$el.panel('open', options);
        },

        closePanel: function(options) {
            this.$el.panel('close', options);
        },

        isPanelOpen: function(options) {
            return this.$el.data('panel').isOpen(options);
        },

        isPanelClosed: function(options) {
            this.$el.data('panel').isClosed(options);
        }

    });


    return {
        ConceptPanel: ConceptPanel
    };

});
