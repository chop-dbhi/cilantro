/* global define */

define([
    'jquery',
    'underscore',
    '../base',
    './core',
    './utils'
], function($, _, base, charts, utils) {

    var ChartLoading = base.LoadView.extend({
        message: 'Chart loading...'
    });

    var FieldChart = charts.Chart.extend({
        template: 'charts/chart',

        loadView: ChartLoading,

        ui: {
            chart: '.chart',
            heading: '.heading',
            status: '.heading .status'
        },

        initialize: function() {
            _.bindAll(this, 'chartClick', 'setValue');
        },

        showLoadView: function () {
            var view = new this.loadView();
            view.render();
            this.ui.chart.html(view.el);
        },

        chartClick: function(event) {
            event.point.select(!event.point.selected, true);
            this.change();
        },

        interactive: function(options) {
            var type;

            if (options.chart) {
                type = options.chart.type;
            }

            if (type === 'pie' || (type === 'column' && options.xAxis.categories)) {
                return true;
            }

            return false;
        },

        getChartOptions: function(resp) {
            var options = utils.processResponse(resp, [this.model]);

            if (options.clustered) {
                this.ui.status.text('Clustered').show();
            }
            else {
                this.ui.status.hide();
            }

            if (this.interactive(options)) {
                this.setOptions('plotOptions.series.events.click', this.chartClick);
            }

            $.extend(true, options, this.chartOptions);
            options.chart.renderTo = this.ui.chart[0];

            return options;
        },

        getField: function() {
            return this.model.id;
        },

        getValue: function() {
            return _.pluck(this.chart.getSelectedPoints(), 'category');
        },

        getOperator: function() {
            return 'in';
        },

        removeChart: function() {
            charts.Chart.prototype.removeChart.apply(this, arguments);

            if (this.node) {
                this.node.destroy();
            }
        },

        onRender: function() {
            // Explicitly set the width of the chart so Highcharts knows
            // how to fill out the space. Otherwise if this element is
            // not in the DOM by the time the distribution request is finished,
            // the chart will default to an arbitary size.
            if (this.options.parentView) {
                this.ui.chart.width(this.options.parentView.$el.width());
            }

            this.showLoadView();

            var _this = this;

            this.model.distribution(function(resp) {
                if (_this.isClosed) return;

                // Convert it into the structure the chart renderer expects
                var data = _.map(resp, function(item) {
                    return {
                        count: item.count,
                        values: [{
                            label: item.label,
                            value: item.value
                        }]
                    };
                });

                data = _.sortBy(data, function(item) {
                    return item.values[0];
                });

                var options = _this.getChartOptions({
                    clustered: false,
                    data: data,
                    outliers: null,
                    size: data.length
                });

                if (data.length) {
                    _this.renderChart(options);
                }
                else {
                    _this.showEmptyView(options);
                }
            });
        },

        setValue: function(value) {
            if (!_.isArray(value)) value = [];

            if (this.chart !== null) {
                var points = this.chart.series[0].points,
                    point,
                    select;

                for (var i = 0; i < points.length; i++) {
                    point = points[i];
                    select = false;

                    if (point.name !== null || value.indexOf(point.category) !== -1) {
                        select = true;
                    }

                    point.select(select, true);
                }
            }
        }
    });


    return {
        FieldChart: FieldChart
    };

});
