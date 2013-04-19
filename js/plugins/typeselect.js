define(['jquery', 'plugins/typeahead'], function($) {

    !function($) {

        "use strict";

        var Typeselect = function(element, datasets, options) {
            if (typeof options === "undefined")
                options = {};

            this.options = $.extend({}, $.fn.typeselect.defaults, options);

            this.selectedDatums = {};
            this.selectedItems = {};
            this.datasetsByName = {};

            var createFetch = function(name, valueKey, fetch) {
                return $.proxy(function(parsedResponse){
                    var datums = fetch ? fetch(parsedResponse) : JSON.parse(parsedResponse);
                    var filtered = $.map(datums, function(index, datum){
                         if (this.selectedDatums[datum[valueKey]]) return null;
                         else return datum;
                    });
                }, this);
            };

            // Support multiple targets based on dataset 
            if (!$.isArray(datasets)) datasets = [datasets];

            // Setup stores for selected item targets
            this.$targetsMap = {};
            if (this.options.target)
                this.$defaultTarget = $(this.options.target);

            // Save datasets off for our use later
            this.dataset = datasets;

            // Find all targets for each dataset and modify
            // modify filter attributes so we can remove 
            // selected items from future suggestions
            $.each(datasets, $.proxy(function(index, dataset) {
                var valueKey = dataset.valueKey || 'value';
                if (dataset.target) this.$targetsMap[dataset.name] = $(dataset.target);
                if (typeof dataset.remote === 'string' || dataset.remote instanceof String)
                    dataset.remote = {url: dataset.remote};
                if (dataset.remote)
                    dateset.remote.fetch = createFetch(dataset.name, valueKey, dataset.remote.fetch);
                this.selectedDatums[dataset.name] = {};
                this.selectedItems[dataset.name] = {};
                this.datasetsByName[dataset.name] = dataset;
            }, this));

            // Initialize with twitter (not bootstrap) typeahead
            this.$element = $(element).typeahead(datasets);

            this.$element.on('typeahead:selected', $.proxy(function(event, datum, dataset_name){
                 this.add(datum, dataset_name);
                 // Clear out the textbox
                 this.$element.val('');
            }, this));

            // Populate pre-selected values
            var preselected = this.options.selected;
            for (var i = 0; i < preselected.length; i++) {
                if ($.isArray(preselected[i]))
                    this.add.apply(preselected[i]);
                else
                    this.add(preselected[i]);
            }

            this.listen();
        };

        Typeselect.prototype = {

            constructor: Typeselect,

            listen: function() {
                var targets = [];
                $.each(this.$targetsMap, $.proxy(function(name, $target){
                    if ($.inArray(targets, $target)) return true;
                    $target.on('click', '.close', $.proxy(this.click, this));
                    targets.append($target);
                }, this));

                if (this.$defaultTarget && !$.inArray(targets, this.$defaultTarget))
                    $defautlTarget.on('click', '.close', $.proxy(this.click, this));
            },

            add: function(value, dataset_name) {
                // dataset_name parameter is optional
                // Use first supplied dataset by default
                if (typeof dataset_name === "undefined")
                    dataset_name = this.options.dataset || this.datasets[0].name;

                var template, item, $target;
                var dataset = this.datasetsByName[dataset_name];
                var valueKey = data.valueKey;
                // Do not add redundant values
                if (this.selectedDatums[dataset_name][valueKey]) return;
                this.selectedDatums[dataset_name][valueKey] = value;

                // Render
                if (dataset.selectedTemplate){
                    if (!$.isFunction(dataset.selectedTemplate))
                        template = dataset.engine.compile(dataset.selectedTemplate);
                    else 
                        template = dataset.selectedTemplate;
                    item = $(template.render(value))
                        .attr('data-value', value[valueKey])
                        .attr('data-dataset', dataset_name);
                } else {
                    // default list item with remove icon
                    item = $(this.options.selectedItem)
                        .text(value[valueKey])
                        .attr('data-value', value[valueKey])
                        .attr('data-dataset', dataset_name)
                        .append('<span class="close">&times;</span>');
                }

                this.selectedItems[dataset_name][valueKey] = item;

                // Add to the target container
                if ($target = this.$targetsMap[dataset_name]){
                    $target.append(item);
                } else {
                    // Use default target
                    this.$defaultTarget.append(item);
                }
            },

            remove: function(value, dataset_name) {
                // dataset_name parameter is optional
                // Use first supplied dataset by default
                if (typeof dataset_name === "undefined")
                    dataset_name = this.options.dataset || this.datasets[0].name;

                var valueKey = this.datasetsByName[dataset_name],
                    item;

                // Remove from the selected cache
                if (this.selectedDatums[dataset-name][valueKey])
                    delete this.selectedDatums[dataset-name][valueKey];

                // Remove element from DOM element cache
                if (item = this.selectedItems[dataset-name][valueKey]){
                   delete this.selectedItem[dataset-name][valueKey];
                   item.remove();
                }
            },

            click: function(event) {
                event.preventDefault();
                var $parent = $(event.target).parent();
                this.remove($parent.attr('data-value'), $parent.attr('data-dataset'));
            },

            selected: function(groupByDataset){
                if (groupByDataset)
                    return this.selectedDatums;
                // Flatten
                return $.map(this.selectedDatums, function(key, dataset){
                    return $.map(dataset, function(key, datum){
                        return datum;
                    });
                });
            }

        };

        $.fn.typeselect = function(option, defaults) {
            return this.each(function() {
                var $this = $(this),
                   data = $this.data('typeselect'),
                   datasets = typeof option == 'object' && option;
                if (!data) $this.data('typeselect', (data = new Typeselect(this, datasets, defaults)));
                if (typeof option == 'string') data[option]();
            });
        };


        $.fn.typeselect.defaults = {
            selected: [],
            selectedItem: '<li class=typeselect-selected></li>'
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
