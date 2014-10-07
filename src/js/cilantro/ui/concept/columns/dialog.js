/* global define */

define([
    'underscore',
    'marionette',
    './layout'
], function(_, Marionette, layout) {


    var ConceptColumnsDialog = Marionette.Layout.extend({
        className: 'columns-modal modal hide full',

        template: 'concept/columns/dialog',

        events: {
            'click [data-save]': 'save',
            'click [data-dismiss]': 'reset'
        },

        ui: {
            error: '[data-target=error]'
        },

        regions: {
            body: '.concept-columns-region'
        },

        regionViews: {
            body: layout.ConceptColumnsLayout
        },

        initialize: function() {
            this.data = {};

            if (!(this.data.view = this.options.view)) {
                throw new Error('view required');
            }

            if (!(this.data.concepts = this.options.concepts)) {
                throw new Error('concepts collection required');
            }

            // Since the view can now be modified both here and by loading a
            // shared query, we need to keep an ear out and listed for the sync
            // event so we can reset the select/available columns. There is
            // no risk of this affecting us post save because even though the
            // sync event will happen after saving a new collection of selected
            // columns, the reset will cause no changes in the UI because the
            // synced result will be the view we just constructed.
            this.listenTo(this.data.view, 'sync', this.reset);
        },

        onRender: function() {
            this.$el.modal({
                show: false,
                keyboard: false,
                backdrop: 'static'
            });

            // Locally reference the view for use below in the cancel, and save methods
            this.columns = new this.regionViews.body({
                view: this.data.view,
                concepts: this.data.concepts
            });

            this.body.show(this.columns);
        },

        reset: function() {
            var _this = this;

            _.delay(function() {
                _this.columns.resetSelected();
            }, 25);

            this.render();
        },

        save: function() {
            this.ui.error.hide();
            var facets = this.columns.selectedToFacets();

            if (facets.length === 0) {
                this.ui.error.html('<p>You must select one or more columns.</p>').show();
                return;
            }

            this.data.view.facets.reset(facets);
            this.data.view.save();
            this.close();
        },

        open: function() {
            this.ui.error.hide();
            this.$el.modal('show');
        },

        close: function() {
            this.$el.modal('hide');
        }
    });


    return {
        ConceptColumnsDialog: ConceptColumnsDialog
    };

});
