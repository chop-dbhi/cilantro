/* global define */

define([
    'underscore',
    'marionette',
    '../base',
    '../core'
], function(_, Marionette, base, c) {

    var LoadingQueryItem = base.LoadView.extend({
        align: 'left'
    });

    var QueryItem = Marionette.ItemView.extend({
        className: 'row-fluid',

        template: 'query/item',

        options: {
            editable: false
        },

        ui: {
            owner: '.owner',
            nonOwner: '.non-owner',
            shareCount: '.share-count',
            publicIcon: '.public-icon'
        },

        events: {
            'click [data-toggle=delete-query-modal]': 'showDeleteQueryModal',
            'click [data-toggle=edit-query-modal]': 'showEditQueryModal',
            'click .shared-query-name': 'openQuery'
        },

        modelEvents: {
            sync: 'render'
        },

        initialize: function() {
            this.data = {};

            if (!(this.data.context = this.options.context)) {
                throw new Error('context model required');
            }

            if (!(this.data.view = this.options.view)) {
                throw new Error('view model required');
            }
        },

        // Custom serialize method to ensure the two nested objects exist for
        // use by the template.
        serializeData: function() {
            var data = this.model.toJSON();
            if (!data.shared_users) data.shared_users = []; // jshint ignore:line
            if (!data.user) data.user = {};
            return data;
        },

        // Set the query's context and view json on the session context
        // and view, navigate to the results to view results
        openQuery: function() {
            this.data.view.save('json', this.model.get('view_json'));
            this.data.context.save('json', this.model.get('context_json'), {
                reset: true
            });
            c.router.navigate('results', {trigger: true});
        },

        showEditQueryModal: function() {
            this.trigger('showEditQueryModal', this.model);
        },

        showDeleteQueryModal: function() {
            this.trigger('showDeleteQueryModal', this.model);
        },

        onRender: function() {
            if (this.options.editable && this.model.get('public')) {
                this.ui.publicIcon.removeClass('hidden');
            }

            if (this.model.get('is_owner')) {
                this.ui.nonOwner.hide();

                var emailHTML = _.pluck(this.model.get('shared_users'), 'email');

                this.ui.shareCount.attr('title', emailHTML.join('<br>'));

                // NOTE: The container needs to be set to overcome an issue
                // with tooltip placement in bootstrap < 3.0. This container
                // setting can be removed after we upgrade to bootstrap >= 3.0.
                this.ui.shareCount.tooltip({
                    html: true,
                    animation: false,
                    placement: 'right',
                    container: 'body'
                });
            } else {
                this.ui.owner.hide();
            }

            if (!this.options.editable) {
                this.ui.nonOwner.hide();
                this.ui.owner.hide();
            }
        }
    });

    return {
        LoadingQueryItem: LoadingQueryItem,
        QueryItem: QueryItem
    };

});
