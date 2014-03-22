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

        ui: {
            noSearchResults: '.no-search-results'
        },

        onRender: function() {
            // Initialize panel plugin to set default state
            this.$el.panel();

            // When a search occurs, the index is filtered relative to the
            // response which contains a listing of IDs that the search
            // has matched.
            this.ui.noSearchResults.hide();

            var _this = this;

            var searchRegion = new this.regionViews.search({
                collection: this.collection,

                handler: function(query, resp) {
                    if (_this.index.currentView.filter(query, resp)) {
                        _this.ui.noSearchResults.hide();
                    }
                    else {
                        _this.ui.noSearchResults.show();
                    }
                }
            });

            // Pass the collection of concepts to be rendered in the index
            var indexRegion = new this.regionViews.index({
                collection: this.collection
            });

            this.search.show(searchRegion);
            this.index.show(indexRegion);
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
