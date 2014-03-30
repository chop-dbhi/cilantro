/* global define */

/*
jQuery plugin for triggering a scroll event once a certain threshold is
reached. A use case of this is the "infinite" scrolling element in which
data is being populated in the element on-demand.

Options:
  `container` - The container element that this element is scrolling
  relative to. Default is window

  `threshold` - Percent scrolled from the top of the element which triggers
    the event. Once this thresholder has been reached the `reset` method
    must be called to reset this state.

  `autofill` - For cases where each trigger event appends to this element
  (e.g. infinite scroll), this option will trigger the `scroller` event
  until this element's is greater than the container height.

  `resize` - Adds an event handler to trigger a reset when the window is
  resized.

  `trigger` - A single handler to fire when the `scroller` event fires.
  This can be bound directly to the element as a normal, but having it
  as an option keeps the code tidier.

Methods are invoked by passing the method name as a string in the
constructor method, e.g. `$(...).scroller('reset')`.

Methods:
  `reset` - Resets the pre-calculated aboslute dimensions and thresholds.
    Use this when the element size changes.
*/

define(['jquery', 'underscore'], function($, _) {

    var defaultOptions = {
        container: window,
        threshold: 0.75,
        autofill: false,
        resize: true,
        trigger: null
    };


    var Scroller = function(element, options) {
        this.element = $(element);
        this.options = $.extend({}, defaultOptions, options);
        this.container = $(options.container);

        var _this = this;

        // Reset the dimensions on a window resize
        if (this.options.resize) {
            $(window).on('resize', _.debounce(function() {
                _this.reset();
            }, 100));
        }

        this.container.on('scroll', _.debounce(function() {
            var scrollTop = _this.container.scrollTop();

            var threshold = (this.element.height() - this.container.height()) *
                             this.options.threshold;

            if (!this.reached && scrollTop >= threshold) {
                this.reached = true;
                this.element.trigger('scroller');
            }
        }, 100));

        // Add trigger handler
        if (this.options.trigger) {
            this.element.on('scroller', this.options.trigger);
        }

        return this;
    };


    Scroller.prototype = {
        constructor: Scroller,

        reset: function() {
            // Reset the flag which denotes when the threshold has been reached
            this.reached = false;

            // If autofill is enabled and the element is too *short* trigger the event
            var remaining = this.element.height() - this.container.height();

            if (this.options.autofill && remaining < 0) {
                this.element.trigger('scroller');
            }

            return this;
        }
    };


    $.fn.scroller = function(option, options) {
        if (typeof option === 'object') {
            options = option;
        }

        this.each(function() {
            var element = $(this),
                data = element.data('scroller');

            // Initialize data
            if (!data) {
                data = new Scroller(this, options);
                element.data('scroller', data);
            }

            // Method call
            if (typeof option === 'string') {
                data[option](options);
            }
        });
    };


    $.fn.scroller.Constructor = Scroller;

});
