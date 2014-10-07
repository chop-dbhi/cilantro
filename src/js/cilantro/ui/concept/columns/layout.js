/* global define */

define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    '../search',
    './available',
    './selected'
], function($, _, Backbone, Marionette, search, available, selected) {


    var ConceptDetailsPopover = Marionette.ItemView.extend({
        className: 'popover right',

        template: 'concept/popover',

        initialize: function() {
            this.$el.css({
                position: 'fixed',
                zIndex: 1200,
                minWidth: 300,
                minHeight: 100
            }).hide();
        },

        serializeData: function() {
            var attrs = this.model.toJSON(),
                fields = this.model.fields;

            if (fields.length === 0) {
                // Wait until the fields render in case there is no description
                if (!attrs.description) {
                    attrs.description = '<i class="icon-spinner icon-spin"></i>';
                }
            }
            else {
                // Use the first field's description if it exists
                if (fields.length === 1) {
                    if (!attrs.description) {
                        attrs.description = fields.models[0].get('description');
                    }
                }
                // Only show fields if more than one exists
                else {
                    attrs.fields = fields.map(function(model) {
                        return model.get('name');
                    }).join(', ');
                }
            }

            // Fallback in case there are no details about the concept
            if (!attrs.description && !attrs.fields) {
                attrs.description = '<em>No description is available</em>';
            }

            return attrs;
        },

        onRender: function() {
            if (this.model.fields.length === 0) {
                this.listenTo(this.model.fields, 'reset', this.show);
                this.model.fields.fetch({reset: true});
            }
        },

        // Updates the popover with the new options
        update: function(options) {
            // In case it is still listening to the model or fields
            this.stopListening();

            this.options = options;
            this.model = options.model;
            this.show();
        },

        show: function() {
            this.render();

            if (this.shown()) {
                this.$el.stop().animate({
                    left: this.options.left,
                    // center the vertical positioning..
                    top: this.options.top - this.$el.outerHeight() / 2
                }, 200);
            }
            // Show to calculate height
            else {
                this.$el.show().css({
                    left: this.options.left,
                    // center the vertical positioning..
                    top: this.options.top - this.$el.outerHeight() / 2
                }).fadeIn(200);
            }
        },

        shown: function() {
            return this.$el.is(':visible');
        },

        hide: function() {
            this.$el.fadeOut(200);
        }
    });


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
            'click': 'hideDetailsPopover',
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

            this.listenTo(this.data.concepts, 'columns:detail',
                this.handleDetailsPopover);

            // Local collection of selected concepts based on the bound `view`
            this.data.selected = new Backbone.Collection();

            // Listen the columns events on the models
            this.data.selected.listenTo(this.data.concepts, 'columns:add',
                function(model) { this.add(model); });

            this.data.selected.on('columns:remove', function(model) {
                this.remove(model);
            });
        },

        handleDetailsPopover: function(model, event) {
            var _this = this, target = $(event.currentTarget);

            clearTimeout(this._detailsDelay);

            // If the popover is already visible, immediately animate to the next
            // target, otherwise delay
            if (event.type === 'mouseover') {
                var timeout = this.popover.shown() ? 100 : 500;

                this._detailsDelay = _.delay(function() {
                    _this.showDetailsPopover(model, target);
                }, timeout);
            }
            else if (event.type === 'mouseout') {
                this._detailsDelay = _.delay(function() {
                    _this.hideDetailsPopover(model, target);
                }, 200);
            }
        },

        showDetailsPopover: function(model, target) {
            target = $(target);

            var offset = target.offset();

            this.popover.update({
                model: model,
                // center the vertical positioning..
                top: offset.top + target.outerHeight() / 2,
                left: offset.left + target.outerWidth()
            });
        },

        hideDetailsPopover: function() {
            if (!this.popover) return;
            this.popover.hide();
        },

        resetSelected: function() {
            this.data.selected.reset();

            var concepts = this.data.concepts;

            this.data.view.facets.each(function(facet) {
                var model = concepts.get(facet.get('concept'));
                if (model) model.trigger('columns:add', model);
            });
        },

        // Maps the selected concepts to the exists facets collection. This
        // ensures other attributes such as sort order are preserved.
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

            // Initialize a bare popover
            this.popover = new ConceptDetailsPopover();
            this.$el.append(this.popover.el);

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
