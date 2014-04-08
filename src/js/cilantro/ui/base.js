/* global define */

define([
    'jquery',
    'underscore',
    'marionette'
], function($, _, Marionette) {

    /*
     * Simple set of views for representing various states.
     *
     * Options include:
     *
     * - icon
     * - message
     * - align
     * - template
     *
     * If a template is not provided, one will be created based on
     * the icon and the message.
     *
     * `align` corresponds to the text alignment. Options are 'left', 'right'
     * and 'center'.
     */

    var StateView = Marionette.ItemView.extend({
        align: 'center',

        constructor: function(options) {
            Marionette.ItemView.prototype.constructor.call(this, options);

            if (!this.template) {
                if (this.options.template) {
                    this.template = this.options.template;
                } else {
                    var html = [];

                    var icon = _.result(this.options, 'icon') ||
                               _.result(this, 'icon');

                    var message = _.result(this.options, 'message') ||
                                  _.result(this, 'message');

                    if (icon) html.push(icon);
                    if (message) html.push(message);

                    this.template = function() {
                        return html.join(' ');
                    };
                }
            }

            if (this.align) this.$el.css('text-align', this.align);
        }
    });


    var EmptyView = StateView.extend({
        className: 'empty-view',

        icon: '<i class="icon-info"></i>',

        message: 'No data available'
    });


    var EmptySearchView = EmptyView.extend({
        className: 'empty-search-view',

        icon: '<i class="icon-search icon-2x"></i>',

        message: 'We could not find anything related to your search'
    });


    var ErrorView = StateView.extend({
        className: 'error-view',

        icon: '<i class="icon-exclamation"></i>',

        message: 'Something went awry..'
    });


    var ErrorOverlayView = ErrorView.extend({
        className: 'error-overlay-view',

        template: 'base/error-overlay',

        onRender: function() {
            $(this.options.target)
                .append(this.$el);
        }
    });


    var LoadView = StateView.extend({
        className: 'load-view',

        icon: '<i class="icon-spinner icon-spin"></i>',

        message: 'Loading...'
    });


    return {
        EmptyView: EmptyView,
        EmptySearchView: EmptySearchView,
        ErrorView: ErrorView,
        ErrorOverlayView: ErrorOverlayView,
        LoadView: LoadView
    };

});
