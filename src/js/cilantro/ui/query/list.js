/* global define */

define([
    'underscore',
    'marionette',
    '../core',
    './item',
], function(_, Marionette, c, item) {

    var QueryList = Marionette.CompositeView.extend({
        itemView: item.QueryItem,

        itemViewContainer: '.items',

        template: 'query/list',

        options: {
            title: 'Queries',
            editable: false,
            emptyMessage: 'You have not yet created any queries nor have had ' +
                          'any shared with you. You can create a new query by ' +
                          'navigating to the "Results" page and clicking on ' +
                          'the "Save Query..." button. This will save a query with ' +
                          'the current filters and column view.'
        },

        ui: {
            title: '[data-target=title]',
            publicIndicator: '.header > div',
            loadingMessage: '[data-target=loading-message]',
            emptyMessage: '[data-target=empty-message]',
            errorMessage: '[data-target=error-message]'
        },

        collectionEvents: {
            sync: 'onCollectionSync',
            error: 'onCollectionError',
            request: 'onCollectionRequest',
            destroy: 'onCollectionDestroy'
        },

        itemViewOptions: function(model, index) {
            return {
                model: model,
                view: this.data.view,
                context: this.data.context,
                editable: this.options.editable,
                index: index
            };
        },

        initialize: function() {
            this.data = {};

            if (!(this.data.context = this.options.context)) {
                throw new Error('context model required');
            }

            if (!(this.data.view = this.options.view)) {
                throw new Error('view model required');
            }

            if (this.options.editable) {
                this.on('itemview:showEditQueryModal', function(options) {
                    c.dialogs.query.open(options.model);
                });

                this.on('itemview:showDeleteQueryModal', function(options) {
                    c.dialogs.deleteQuery.open(options.model);
                });
            }
        },

        _refreshList: function() {
            this.ui.errorMessage.hide();
            this.ui.loadingMessage.hide();
            this.checkForEmptyCollection();
        },

        // When a model is destroyed, it does not call sync on the collection
        // but it does trigger a destroy event on the collection. That is the
        // reason for this separate handler. When a query is deleted, we will
        // get the request event and then destroy event, there will never be
        // a sync event in the case a user deleting a query.
        onCollectionDestroy: function() {
            this._refreshList();
        },

        onCollectionError: function() {
            this.ui.emptyMessage.hide();
            this.ui.errorMessage.show();
            this.ui.loadingMessage.hide();
        },

        onCollectionRequest: function() {
            this.ui.emptyMessage.hide();
            this.ui.errorMessage.hide();
            this.ui.loadingMessage.show();
        },

        onCollectionSync: function() {
            this._refreshList();
        },

        checkForEmptyCollection: function() {
            if (this.collection.length === 0) {
                this.ui.emptyMessage.show();
            }
            else {
                this.ui.emptyMessage.hide();
            }
        },

        onRender: function() {
            this.ui.title.html(this.options.title);

            if (!this.options.editable) this.ui.publicIndicator.hide();

            this.ui.emptyMessage.html(this.options.emptyMessage);
            this.checkForEmptyCollection();
        }
    });

    return {
        QueryList: QueryList
    };

});
