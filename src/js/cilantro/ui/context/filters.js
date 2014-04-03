/* global define */

define([
    'underscore',
    'marionette',
    '../base',
    '../core',
], function(_, Marionette, base, c) {


    var ContextFilter = Marionette.ItemView.extend({
        className: 'context-filter',

        template: 'context/filter',

        events: {
            'click .language': 'clickShow',
            'click .actions .remove': 'clickRemove',
            'click .state': 'clickState',
            'change .state input': 'clickState',
            'click .state input': 'stopPropagation'
        },

        ui: {
            loader: '.actions .icon-spinner',
            actions: '.actions button',
            state: '.state',
            check: '.state input',
            language: '.language'
        },

        modelEvents: {
            request: 'showLoadView',
            sync: 'hideLoadView',
            error: 'hideLoadView',
            change: 'renderLanguage',
            'change:enabled': 'renderState'
        },

        stopPropagation: function(event) {
            event.preventDefault();
            event.stopPropagation();
        },

        // Navigate to query page when a concept is triggered
        clickShow: function() {
            c.router.navigate('query', {trigger: true});
            c.trigger(c.CONCEPT_FOCUS, this.model.get('concept'));
        },

        clickRemove: function() {
            if (this.model.unapply()) {
                this.$el.fadeOut({
                    duration: 400,
                    easing: 'easeOutExpo'
                });
            }
        },

        // Toggle the enabled state of the node
        clickState: function(event) {
            event.preventDefault();
            var _this = this;
            _.defer(function() {
                _this.model.toggleEnabled();
                _this.model.apply();
            });
        },

        renderEnabled: function() {
            this.$el.removeClass('disabled');
            this.ui.state.attr('title', 'Disable');
            this.ui.check.prop('checked', true);
            this.ui.check.attr('checked', true);
        },

        renderDisabled: function() {
            this.$el.addClass('disabled');
            this.ui.state.attr('title', 'Enable');
            this.ui.check.prop('checked', false);
            this.ui.check.attr('checked', false);
        },

        renderState: function() {
            if (this.model.get('enabled') !== false) {
                this.renderEnabled();
            }
            else {
                this.renderDisabled();
            }
        },

        renderLanguage: function() {
            this.ui.language.html(this.model.get('language'));
        },

        showLoadView: function() {
            this.ui.loader.show();
            this.ui.actions.hide();
        },

        hideLoadView: function() {
            this.ui.loader.hide();
            this.ui.actions.show();
        },

        onRender: function() {
            this.ui.loader.hide();
            this.renderLanguage();
            this.renderState();
        }
    });


    var ContextNoFilters = base.EmptyView.extend({
        template: 'context/empty',

        ui: {
            noFiltersResultsMessage: '.no-filters-results-workspace',
            noFiltersQueryMessage: '.no-filters-query-workspace'
        },

        onRender: function() {
            this.listenTo(c.router, 'route', this.toggleMessage);
            this.toggleMessage();
        },

        onClose: function() {
            this.stopListening(c.router);
        },

        toggleMessage: function() {
            if (c.router.isCurrent('results')) {
                this.ui.noFiltersQueryMessage.hide();
                this.ui.noFiltersResultsMessage.show();
            }
            else if (c.router.isCurrent('query')) {
                this.ui.noFiltersQueryMessage.show();
                this.ui.noFiltersResultsMessage.hide();
            }
        }
    });


    var ContextFilters = Marionette.CollectionView.extend({
        itemView: ContextFilter,

        emptyView: ContextNoFilters
    });


    return {
        ContextFilter: ContextFilter,
        ContextFilters: ContextFilters,
        ContextNoFilters: ContextNoFilters
    };


});
