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
            // Begin hack to fix caching issue
            this.urlToDatasetMap = {};
            // End hack to fix caching issue

            var createFilter = function(name, valueKey, filter, selectedDatums) {
                return function(parsedResponse){
                    var datums = filter ? filter(parsedResponse) : parsedResponse;
                    var filtered = $.map(datums, function(datum, index){
                         if (selectedDatums[datum[valueKey]]) return null;
                         else return datum;
                    });
                    return filtered;
                };
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
                var valueKey = dataset.valueKey || 'value', dataset_name = dataset.name;
                if (dataset.target) this.$targetsMap[dataset.name] = $(dataset.target);
                if (typeof dataset.remote === 'string' || dataset.remote instanceof String)
                    dataset.remote = {url: dataset.remote};
                this.selectedDatums[dataset_name] = {};

                if (dataset.remote){
                    // Begin hack to fix caching issue
                    dataset.name = dataset.remote.url.replace(/[?%&=./:]/g, function(c){
                        var r = {
                            '?':'q',
                            '%':'p',
                            '&':'a',
                            '=':'e',
                            '.':'d',
                            '/':'s',
                            ':':'c'
                        };
                        return r[c];
                    });
                    this.urlToDatasetMap[dataset.name] = dataset_name;
                    // End hack to fix caching issue
                    dataset.remote.filter = createFilter(dataset_name, valueKey, 
                        dataset.remote.filter, this.selectedDatums[dataset_name]);
                }
                // TODO this cache will will need to be
                // be the swapped out dataset.name if we did that above
                this.selectedItems[dataset_name] = {};
                this.datasetsByName[dataset_name] = dataset;

                if (dataset.selected)
                    this.prePopulate(dataset.selected, dataset_name);
            }, this));

            // Initialize with twitter (not bootstrap) typeahead
            this.$element = $(element).typeahead(datasets);

            this.$element.on('typeahead:selected', $.proxy(function(event, datum, dataset_name){
                 this.add(datum, dataset_name);
                 // Clear out the textbox
                 this.$element.blur();
                 this.$element.val('');
            }, this));

            this.listen();
        };

        Typeselect.prototype = {

            constructor: Typeselect,

            destroy: function(){
                this.$element.typeahead('destroy');
            },

            listen: function() {
                var targets = [];
                $.each(this.$targetsMap, $.proxy(function(name, $target){
                    if (~$.inArray($target, targets)) return true;
                    $target.on('click', '.close', $.proxy(this.click, this));
                    targets.push($target);
                }, this));

                if (this.$defaultTarget && !$.inArray(targets, this.$defaultTarget))
                    $defaultTarget.on('click', '.close', $.proxy(this.click, this));
            },

            add: function(value, dataset_name) {
                var engine, template, item, $target;
                // dataset_name parameter is optional
                // Use first supplied dataset by default
                if (typeof dataset_name === "undefined")
                    dataset_name = this.options.dataset || this.datasets[0].name;
                // Begin hack to fix caching issue
                if (this.urlToDatasetMap.hasOwnProperty(dataset_name))
                    dataset_name = this.urlToDatasetMap[dataset_name];
                // End hack to fix caching issue
                var dataset = this.datasetsByName[dataset_name];
                var valueKey = dataset.valueKey || "value";
                // Do not add redundant values
                if (this.selectedDatums[dataset_name][value[valueKey]]) return;
                this.selectedDatums[dataset_name][value[valueKey]] = value;

                // Render
                template = dataset.selectedTemplate || this.options.selectedTemplate;
                engine = dataset.engine || this.options.engine;

                if (typeof template === 'string' || template instanceof String)
                     template = engine.compile(template);
                item = $(template.render(value, valueKey))
                     .attr('data-value', value[valueKey])
                     .attr('data-dataset', dataset_name);

                this.selectedItems[dataset_name][value[valueKey]] = item;

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

                // Begin hack to fix caching issue
                if (this.urlToDatasetMap.hasOwnProperty(dataset_name))
                    dataset_name = this.urlToDatasetMap[dataset_name];
                // End hack to fix caching issue

                var valueKey = this.datasetsByName[dataset_name].valueKey || 'value',
                    item;

                // Remove from the selected cache
                if (this.selectedDatums[dataset_name][value])
                    delete this.selectedDatums[dataset_name][value];

                // Remove element from DOM element cache
                if (item = this.selectedItems[dataset_name][value]){
                   delete this.selectedItems[dataset_name][value];
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
            },

            prePopulate: function(selectedDatums, dataset_name){
                var index;
                if (!$.isArray(selectedDatums))
                    selectedDatums = [selectedDatums];
                for (index = 0; index < selectedDatums.length; index++)
                    this.add(selectedDatums[index], dataset_name);
            }

        };

        $.fn.typeselect = function(option, defaults) {
            return this.each(function() {
                var $this = $(this),
                   data = $this.data('typeselect'),
                   datasets = option;
                if (!data) $this.data('typeselect', (data = new Typeselect(this, datasets, defaults)));
                if (typeof option === 'string') data[option]();
            });
        };


        $.fn.typeselect.defaults = {
            selectedTemplate: {  render: function(value, valueKey){
                return $('<li class=typeselect-selected></li>')
                        .text(value[valueKey])
                        .append('<span class="close">&times;</span>');
               }
            }
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
