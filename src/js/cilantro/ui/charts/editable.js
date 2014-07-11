/* global define */

define([
    'jquery',
    'underscore',
    './dist',
    './axis'
], function($, _, dist, axis) {

    var EditableFieldChart = dist.FieldChart.extend({
        template: 'charts/editable-chart',

        toolbarAnimationTime: 200,

        formAnimationTime: 300,

        events: _.extend({
            'click .fullsize': 'toggleExpanded'
        }, dist.FieldChart.prototype.events),

        ui: _.extend({
            toolbar: '.btn-toolbar',
            fullsizeToggle: '.fullsize',
            form: '.editable',
            xAxis: '[name=x-Axis]',
            yAxis: '[name=y-Axis]',
            series: '[name=series]'
        }, dist.FieldChart.prototype.ui),

        onRender: function() {
            if (this.options.editable === false) {
                this.ui.form.detach();
                this.ui.toolbar.detach();
            }
            else {
                this.xAxis = new axis.FieldAxis({
                    el: this.ui.xAxis,
                    collection: this.collection
                });

                this.yAxis = new axis.FieldAxis({
                    el: this.ui.yAxis,
                    collection: this.collection
                });

                this.series = new axis.FieldAxis({
                    el: this.ui.series,
                    enumerableOnly: true,
                    collection: this.collection
                });

                if (this.model) {
                    if (this.model.get('xAxis')) {
                        this.ui.form.hide();
                    }

                    if (this.model.get('expanded')) {
                        this.expand();
                    }
                    else {
                        this.contract();
                    }
                }
            }
        },

        customizeOptions: function(options) {
            this.ui.status.detach();

            this.ui.heading.text(options.title.text);
            options.title.text = '';

            // Check if any data is present.
            if (!options.series[0]) {
                this.ui.chart.html('<p class=no-data>Unfortunately, there is no ' +
                                   'data to graph here.</p>');
                return;
            }

            this.ui.form.hide();

            var statusText = [];
            if (options.clustered) {
                statusText.push('Clustered');
            }

            if (statusText[0]) {
                this.ui.status.text(statusText.join(', ')).show();
                this.ui.heading.append(this.$status);
            }

            if (this.interactive(options)) {
                this.enableChartEvents();
            }

            $.extend(true, options, this.chartOptions);
            options.chart.renderTo = this.ui.chart[0];

            return options;
        },

        // Ensure rapid successions of this method do not occur.
        changeChart: function(event) {
            if (event) {
                event.preventDefault();
            }

            var _this = this;
            this.collection.when(function() {
                var xAxis, yAxis, series, seriesIdx;

                // TODO fix this nonsense
                if (event === null || typeof event === 'undefined') {
                    xAxis = _this.model.get('xAxis');
                    if (xAxis) {
                        _this.xAxis.$el.val(xAxis.toString());
                    }

                    yAxis = _this.model.get('yAxis');
                    if (yAxis) {
                        _this.yAxis.$el.val(yAxis.toString());
                    }

                    series = _this.model.get('series');
                    if (series) {
                        this.series.$el.val(series.toString());
                    }
                }

                xAxis = _this.xAxis.getSelected();
                yAxis = _this.yAxis.getSelected();
                series = _this.series.getSelected();

                if (!xAxis) return;

                var url = _this.model.get('_links').distribution.href;

                var fields = [xAxis];
                var data = 'dimension=' + xAxis.id;

                if (yAxis) {
                    fields.push(yAxis);
                    data = data + '&dimension=' + yAxis.id;
                }

                if (series) {
                    if (yAxis) {
                        seriesIdx = 2;
                    }
                    else {
                        seriesIdx = 1;
                    }

                    data = data + '&dimension=' + series.id;
                }

                if (event && _this.model) {
                    _this.model.set({
                        xAxis: xAxis.id,
                        yAxis: (yAxis) ? yAxis.id : null,
                        series: (series) ? series.id : null
                    });
                }

                _this.update(url, data, fields, seriesIdx);
            });
        },

        // Disable selected fields since using the same field for multiple
        // axes doesn't make sense.
        disableSelected: function(event) {
            var $target = $(event.target);

            // Changed to an empty value, unhide other dropdowns.
            if (this.xAxis.el === event.target) {
                this.yAxis.$('option').prop('disabled', false);
                this.series.$('option').prop('disabled', false);
            }
            else if (this.yAxis.el === event.target) {
                this.xAxis.$('option').prop('disabled', false);
                this.series.$('option').prop('disabled', false);
            }
            else {
                this.xAxis.$('option').prop('disabled', false);
                this.yAxis.$('option').prop('disabled', false);
            }

            var value = $target.val();

            if (value !== '') {
                if (this.xAxis.el === event.target) {
                    this.yAxis.$('option[value=' + value + ']')
                        .prop('disabled', true).val('');
                    this.series.$('option[value=' + value + ']')
                        .prop('disabled', true).val('');
                }
                else if (this.yAxis.el === event.target) {
                    this.xAxis.$('option[value=' + value + ']')
                        .prop('disable', true).val('');
                    this.series.$('option[value=' + value + ']')
                        .prop('disable', true).val('');
                }
                else {
                    this.xAxis.$('option[value=' + value + ']')
                        .prop('disable', true).val('');
                    this.yAxis.$('option[value=' + value + ']')
                        .prop('disable', true).val('');
                }
            }
        },

        toggleExpanded: function() {
            var expanded = this.model.get('expanded');

            if (expanded) {
                this.contract();
            }
            else {
                this.expand();
            }

            this.model.save({
                expanded: !expanded
            });
        },

        resize: function() {
            var chartWidth = this.ui.chart.width();

            if (this.chart) {
                this.chart.setSize(chartWidth, null, false);
            }
        },

        expand: function() {
            this.$fullsizeToggle.children('i')
                .removeClass('icon-resize-small')
                .addClass('icon-resize-full');
            this.$el.addClass('expanded');
            this.resize();
        },

        contract: function() {
            this.$fullsizeToggle.children('i')
                .removeClass('icon-resize-full')
                .addClass('icon-resize-small');
            this.$el.removeClass('expanded');
            this.resize();
        },

        hideToolbar: function() {
            this.ui.toolbar.fadeOut(this.toolbarAnimationTime);
        },

        showToolbar: function() {
            this.ui.toolbar.fadeIn(this.toolbarAnimationTime);
        },

        toggleEdit: function() {
            if (this.ui.form.is(':visible')) {
                this.ui.form.fadeOut(this.formAnimationTime);
            }
            else {
                this.ui.form.fadeIn(this.formAnimationTime);
            }
        }
    });

    return {
        EditableFieldChart: EditableFieldChart
    };

});
