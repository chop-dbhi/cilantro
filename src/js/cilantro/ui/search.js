/* global define */

define([
    'underscore',
    'marionette',
    '../constants'
], function(_, Marionette, constants) {

    // Search input box that triggers a `search` event the input value
    // changes. As this is intended for search, non-printing keys do not
    // trigger the event.
    var Search = Marionette.ItemView.extend({
        className: 'search',

        template: 'search',

        options: {
            placeholder: 'Search...',
            delay: constants.INPUT_DELAY
        },

        ui: {
            input: 'input'
        },

        events: {
            'keyup @ui.input': '_triggerSearch'
        },

        constructor: function(options) {
            // This event needs to be debounced before the call to the super
            // constructor or the keyup event will not be mapped to any handler
            // since _triggerSearch won't exist yet.
            this._triggerSearch = _.debounce(this.triggerSearch, this.options.delay);

            Marionette.ItemView.prototype.constructor.call(this, options);

            this._query = '';

            // If this is triggered externally, ensure the input text reflects the
            // query.
            this.on('search', this.renderInputText);

            // If a search method is supplied, bind it to the search event
            if (this.search) this.on('search', this.search);
        },

        onRender: function() {
            this.ui.input.attr('placeholder', this.options.placeholder);

            // Focus the input on render, but defer until end of the loop
            // to ensure it is in the DOM.
            var _this = this;

            _.defer(function() {
                if (_this._isRendered && !_this.isClosed) {
                    _this.ui.input.focus();
                }
            });
        },

        renderInputText: function(query) {
            if (this.ui.input.val() !== query) {
                this._query = query;
                this.ui.input.val(query);
            }
        },

        triggerSearch: function(event) {
            // No bubbling of submit events
            event.stopImmediatePropagation();

            var query = this.ui.input.val().trim();

            // Prevent redundant queries
            if (query === this._query) return;

            this._query = query;

            this.trigger('search', query);
        }
    });


    return {
        Search: Search
    };

});
