/* global define */

define([
    'underscore',
    'marionette',
    '../core'
], function(_, Marionette, c) {


    // Returns a flat list of values for `key` that is built by recursing
    // over the `attrs.children` if present.
    var flattenAttr = function(attrs, key, items) {
        items = items || [];

        if (!attrs) return items;

        if (attrs[key]) items.push(attrs[key]);

        // Recurse and flatten children
        if (attrs.children) {
            _.each(attrs.children, function(child) {
                flattenAttr(child, key, items);
            });
        }

        return items;
    };


    var ContextItem = Marionette.ItemView.extend({
        className: 'context-item',

        template: 'context/item',

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
            if (this.model.remove()) {
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
            if (this.model.isEnabled()) {
                this.renderEnabled();
            }
            else {
                this.renderDisabled();
            }
        },

        renderLanguage: function() {
            var text = flattenAttr(this.model.toJSON(), 'language').join(', ');
            this.ui.language.html(text);
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


    return {
        ContextItem: ContextItem
    };


});
