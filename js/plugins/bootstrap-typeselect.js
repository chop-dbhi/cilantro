define(['jquery'], function($) {

    !function($) {

        "use strict";

        var Typeselect = function(element, options) {

            // Initialize with typeahead
            this.$element = $(element).typeahead(options);
            this.options = $.extend({}, $.fn.typeselect.defaults, options);
            this.$target = $(this.options.target);

            var typeahead = this.$element.data('typeahead');

            // Override/extend typeahead methods
            this._process = $.proxy(typeahead.process, typeahead);
            typeahead.process = $.proxy(this.process, this);

            // Raw selected values
            this.selected = [];

            // Object of DOM items by value
            this.selectedItems = {};

            // Populate pre-selected values
            var preselected = this.options.selected || [];
            for (var i = 0; i < preselected.length; i++) {
                this.add(preselected[i]);
            }

            this.listen();
        };

        Typeselect.prototype = {

            constructor: Typeselect,

            listen: function() {
                this.$element
                    .on('keydown', $.proxy(this.keyup, this))
                    .on('change', $.proxy(this.change, this))

                this.$target
                    .on('click', '.close', $.proxy(this.click, this))

            },

            add: function(value) {
                // Do not add redundant values
                if (this.selectedItems[value]) return;
                this.selected.push(value);

                // Add the item to the target container
                var item = $(this.options.selectedItem)
                    .text(value)
                    .attr('data-value', value)
                    .append('<span class="close">&times;</span>');

                this.selectedItems[value] = item;

                // Add to the target container
                this.$target.append(item);
            },

            remove: function(value) {
                var item = this.selectedItems[value],
                    index = this.selected.indexOf(value);

                // Remove from the selected array
                if (index >= 0) this.selected.pop(index);
                // Remove element from cache
                delete this.selectedItems[value];
                // Remove element from DOM
                item.remove();
            },

            change: function() {
                var value = this.$element.val();
                this.add(value);
                // Clear the value of the input for the next
                this.$element.val('');
            },

            process: function(items) {
                var that = this;

                // Remove items that are already selected
                items = $.grep(items, function(item) {
                    return that.selectedItems[item] == null;
                });

                return this._process(items);
            },

            click: function(event) {
                event.preventDefault();
                this.remove($(event.target).parent().attr('data-value'));
            }
        }

        $.fn.typeselect = function(option) {
            return this.each(function() {
                var $this = $(this),
                   data = $this.data('typeselect'),
                   options = typeof option == 'object' && option;
                if (!data) $this.data('typeselect', (data = new Typeselect(this, options)));
                if (typeof option == 'string') data[option]();
            });
        };


        $.fn.typeselect.defaults = {
            selected: [],
            selectedItem: '<li></li>'
        };


        $.fn.typeselect.Constructor = Typeselect;


        /* TYPESELECT DATA-API
         * =================== */
        $(document).on('focus.typeselect.data-api', '[data-provide="typeselect"]', function(e) {
            var $this = $(this);
            if ($this.data('typeselect')) return;
            e.preventDefault();
            $this.typeselect($this.data());
        });

    }($);

});
