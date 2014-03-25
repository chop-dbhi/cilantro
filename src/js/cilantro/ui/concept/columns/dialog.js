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
            'click [data-dismiss]': 'cancel'
        },

        regions: {
            body: '.modal-body'
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

        cancel: function() {
            var _this = this;

            _.delay(function() {
                _this.columns.resetSelected();
            }, 25);
        },

        save: function() {
            this.data.view.facets.reset(this.columns.selectedToFacets());
            this.data.view.save();
            this.close();
        },

        open: function() {
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
