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
            title: '.title',
            publicIndicator: '.header > div'
        },

        collectionEvents: {
            sync: 'onCollectionSync',
            error: 'onCollectionError',
            request: 'onCollectionRequest',
            destroy: '_refreshList',
            remove: '_refreshList'
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
            this.$('.error-message').hide();
            this.$('.loading-indicator').hide();
            this.checkForEmptyCollection();
        },

        onCollectionError: function() {
            this.$('.empty-message').hide();
            this.$('.error-message').show();
            this.$('.loading-indicator').hide();
        },

        onCollectionRequest: function() {
            this.$('.empty-message').hide();
            this.$('.error-message').hide();
            this.$('.loading-indicator').show();
        },

        onCollectionSync: function() {
            this._refreshList();
        },

        checkForEmptyCollection: function() {
            if (this.collection.length === 0) {
                this.$('.empty-message').show();
            }
            else {
                this.$('.empty-message').hide();
            }
        },

        onRender: function() {
            this.ui.title.html(this.options.title);

            if (!this.options.editable) this.ui.publicIndicator.hide();

            this.$('.empty-message').html(this.options.emptyMessage);
            this.checkForEmptyCollection();
        }
    });

    return {
        QueryList: QueryList
    };

});
