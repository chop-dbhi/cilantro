/* global define */

define([
    'underscore',
    'marionette',
    '../base',
    '../core',
], function(_, Marionette, base, c) {

    var flattenLanguage = function(attrs, toks, type, wrap) {
        if (!attrs) return '';
        if (!toks) toks = [];
        if (wrap !== false) wrap = true;

        if (wrap) toks.push('<ul>');

        if (attrs.language) {
            toks.push('<li>' + attrs.language + '</li>');
        }
        else if (attrs.type && attrs.children.length) {
            if (type) {
                toks.push('<li><small>' + attrs.type.toUpperCase() + '</small><ul>');
            }

            _.each(attrs.children, function(child) {
                flattenLanguage(child, toks, type, false);
            });

            if (type) {
                toks.push('</ul></li>');
            }
        }

        if (wrap) toks.push('</ul>');

        return toks.join('');
    };

    var ContextFilter = Marionette.ItemView.extend({
        className: 'context-filter',

        template: 'context/filter',

        ui: {
            actions: '[data-target=actions]',
            loader: '[data-target=loader]',
            remove: '[data-action=remove]',
            enable: '[data-action=enable]',
            description: '[data-target=description]',
            required: '[data-target=required]'
        },

        events: {
            'click': 'clickShow',
            'click @ui.remove': 'clickRemove',
            'click @ui.enable': 'toggleEnabled',
        },

        modelEvents: {
            request: 'showLoadView',
            sync: 'hideLoadView',
            error: 'hideLoadView',
            change: 'render'
        },

        // Navigate to query page when a concept is triggered
        clickShow: function() {
            c.trigger(c.CONCEPT_FOCUS, this.model.get('concept'));
        },

        clickRemove: function(event) {
            event.stopPropagation();
            this.model.unapply();
        },

        // Toggle the enabled state of the node
        toggleEnabled: function(event) {
            event.stopPropagation();
            this.model.toggleEnabled();
        },

        renderEnabled: function() {
            this.$el.removeClass('disabled');
            this.ui.enable.attr('title', 'Disable');
            this.ui.enable.prop('checked', true);
        },

        renderDisabled: function() {
            this.$el.addClass('disabled');
            this.ui.enable.attr('title', 'Enable');
            this.ui.enable.prop('checked', false);
        },

        renderState: function() {
            if (this.model.get('enabled') !== false) {
                this.renderEnabled();
            }
            else {
                this.renderDisabled();
            }
        },

        renderDescription: function() {
            var text = flattenLanguage(this.model.attributes);
            this.ui.description.html(text);
        },

        showLoadView: function() {
            this.ui.loader.show();
            this.ui.description.hide();
        },

        hideLoadView: function() {
            this.ui.loader.hide();
            this.ui.description.show();
        },

        onRender: function() {
            // Required filters cannot be removed nor disabled
            this.ui.actions.toggle(!this.model.get('required'));
            this.ui.enable.toggle(!this.model.get('required'));
            this.ui.required.toggle(this.model.get('required') === true);

            this.ui.required.tooltip({
                container: 'body',
                placement: 'left',
                delay: 500
            });

            this.renderDescription();
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
        ContextNoFilters: ContextNoFilters,
        flattenLanguage: flattenLanguage
    };


});
