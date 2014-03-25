/* global define */

define([
    'underscore',
    'backbone',
    'marionette',
    '../search',
    './available',
    './selected'
], function(_, Backbone, Marionette, search, available, selected) {


    // Two-column layout representing the available columns on
    // the left side and the selected columns on the right.
    // The data this view expects includes:
    // - collection: a collection of concepts that are deemed viewable
    // - facets: the facets collection of a view to be rendered
    //   in this view as selectable and orderable columns
    // - facets: the collection of Facets derived from the view that
    //   represent the concepts being chosen.
    var ConceptColumnsLayout = Marionette.Layout.extend({
        className: 'concept-columns',

        template: 'concept/columns/layout',

        events: {
            'click [data-action=clear]': 'triggerRemoveAll'
        },

        regions: {
            search: '.search-region',
            available: '.available-region',
            selected: '.selected-region'
        },

        regionViews: {
            search: search.ConceptSearch,
            available: available.AvailableColumns,
            selected: selected.SelectedColumns
        },

        initialize: function() {
            this.data = {};

            if (!(this.data.view = this.options.view)) {
                throw new Error('view required');
            }

            if (!(this.data.concepts = this.options.concepts)) {
                throw new Error('concepts collection required');
            }

            // Local collection of selected concepts based on the bound `view`
            this.data.selected = new Backbone.Collection();

            // Listen the columns events on the models
            this.data.selected.listenTo(this.data.concepts, 'columns:add', function(model) {
                this.add(model);
            });

            this.data.selected.on('columns:remove', function(model) {
                this.remove(model);
            });
        },

        resetSelected: function() {
            this.data.selected.reset();

            var concepts = this.data.concepts;

            this.data.view.facets.each(function(facet) {
                var model = concepts.get(facet.get('concept'));
                if (model) model.trigger('columns:add', model);
            });
        },

        // Maps the selected concepts to the exists facets collection. This ensures
        // other attributes such as sort order are preserved.
        selectedToFacets: function() {
            var _this = this;

            return this.data.selected.map(function(model) {
                var facet = _this.data.view.facets.get(model.id);

                // Existing facet, serialize as is
                if (facet) return facet.toJSON();

                return {
                    concept: model.id
                };
            });
        },

        onRender: function() {
            this.$el.modal({show: false});

            var searchRegion = new this.regionViews.search({
                placeholder: 'Search available columns by name, description, ' +
                             'or data value...',
                collection: this.data.concepts,
                handler: function(query, resp) {
                    availableRegion.filter(query, resp);
                }
            });

            var availableRegion = new this.regionViews.available({
                collapsable: false,
                collection: this.data.concepts
            });

            var selectedRegion = new this.regionViews.selected({
                collection: this.data.selected
            });

            this.search.show(searchRegion);
            this.available.show(availableRegion);
            this.selected.show(selectedRegion);

            // If both collection are populated, reset the selected collection,
            // otherwise wait until they are reset.
            if (this.data.view.facets.length > 0 && this.data.concepts.length) {
                this.resetSelected();
            }
            else {
                this.listenToOnce(this.data.view.facets, 'reset', this.resetSelected);
                this.listenToOnce(this.data.concepts, 'reset', this.resetSelected);
            }
        },

        triggerRemoveAll: function() {
            // Create a temporary array to prevent the collection from mutating
            // in place when triggering the events.
            var models = this.data.selected.slice(0);

            _.each(models, function(model) {
                model.trigger('columns:remove', model);
            });
        }
    });


    return {
        ConceptColumnsLayout: ConceptColumnsLayout
    };

});
