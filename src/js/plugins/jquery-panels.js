/* global define */

/*
jQuery plugin for an side-panel which can open and close on the
left or right edge of the document.

Methods are invoked by passing the method name as a string in the
constructor method, e.g. `$(...).panel('open')`.

Methods:
  `open` - Opens the panel
  `close` - Closes the panel
  `toggle` - Toggles the panel open/close opened
  'isOpen' - Returns true if the panel is open
  'isClosed' - Returns true if the panel is closed

CSS classes:
  `.panel` - base class for panel container
  `.panel-toggle` - edge toggle on the panel itself which is kept
      exposed while in a closed opened
  `.panel-right` - positions the panel on the right edge of the document
  `.panel-left` - positions the panel on the left edge of the document
  `.closed` - start the panel in a closed opened

HTML markup:
  <div class="panel panel-left closed">
      <div class="panel-toggle"></div>
      <div class="panel-content">
          ...
      </div>
  </div>
*/

define(['jquery'], function($) {

    var getSlideWidth = function(element, options) {
        options = options || {};

        // Total width of panel
        var slideWidth = element.outerWidth(),
            toggle = element.children('.panel-toggle');

        // If a .panel-toggle exists within the panel, substract the width
        // to it is still visible for use
        if (options.full !== false && toggle[0]) {
            return slideWidth - toggle.outerWidth();
        }

        return slideWidth;
    };


    var Panel = function(element, options) {
        this.element = $(element);

        this.options = $.extend({
            side: 'left',
            closed: false
        }, options);

        this.opened = true;

        if (this.options.side === 'right' || this.element.hasClass('panel-right')) {
            this.side = 'right';
        } else {
            this.side = 'left';
        }

        this.element.addClass('panel-' + this.side);

        // Hide without animation
        if (this.options.closed === true || this.element.hasClass('closed')) {
            this.opened = false;
            this.element.addClass('closed').hide();
        }

        var _this = this;

        this.element.on('click', '.panel-toggle', function() {
            _this.toggle();
        });

        return this;
    };


    Panel.prototype = {
        constructor: Panel,

        open: function(options) {
            if (this.opened) return;

            options = options || {};

            this.opened = true;

            var css = {},
                attrs = {};

            // Ensure the position is off screen to start. This
            // is to handle the case when the element was hidden
            css[this.side] = -getSlideWidth(this.element, options);
            attrs[this.side] = 0;

            this.element.css(css).show().stop();

            if (options.animate !== false) {
                this.element.animate(attrs, 300);
            } else {
                this.element.css(attrs);
            }

            this.element.removeClass('closed');
        },

        close: function(options) {
            if (!this.opened) return;

            options = options || {};

            this.opened = false;

            var attrs = {},
                slideWidth = getSlideWidth(this.element, options);

            attrs[this.side] = -slideWidth;

            this.element.stop();

            if (options.animate !== false) {
                this.element.animate(attrs, 300);
            } else {
                this.element.css(attrs);
            }

            this.element.addClass('closed');
        },

        toggle: function() {
            if (this.opened) {
                this.close();
            } else {
                this.open();
            }
        },

        isOpen: function() {
            return this.opened;
        },

        isClosed: function() {
            return !this.opened;
        }
    };


    $.fn.panel = function(option, options) {
        if (typeof option === 'object') options = option;

        this.each(function() {
            var element = $(this),
                data = element.data('panel');

            // Initialize data
            if (!data) {
                data = new Panel(this, options);
                element.data('panel', data);
            }

            // Method call
            if (typeof option === 'string') {
                data[option](options);
            }
        });
    };


    $.fn.panel.Constructor = Panel;


    $(function() {
        // Bootstrap pre-rendered DOM elements
        $('.panel').panel();

        $('[data-toggle*=panel]').each(function() {
            var toggle = $(this);

            toggle.on('click', function() {
                var panel;

                // If this data-toggle specifies a target, use that, otherwise assume
                // it is a .panel-toggle within the panel itself.
                if (toggle.data('target')) {
                    panel = $(toggle.data('target'));
                } else {
                    panel = toggle.parent();
                }

                panel.panel('toggle');
            });
        });
    });

});
