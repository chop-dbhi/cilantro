/* global define */

define([
    'jquery',
    'underscore',
    'backbone',
    'highcharts',
    '../base',
    '../controls',
    './options'
], function($, _, Backbone, Highcharts, base, controls, chartOptions) {

    // Highcharts options are very nested.. this makes the common ones more
    // accessible. Use the 'setOption' method to parse the options.
    var OPTIONS_MAP = {
        el: 'chart.renderTo',
        type: 'chart.type',
        height: 'chart.height',
        width: 'chart.width',
        labelFormatter: 'plotOptions.series.dataLabels.formatter',
        tooltipFormatter: 'tooltip.formatter',
        animate: 'plotOptions.series.animation',
        categories: 'xAxis.categories',
        title: 'title.text',
        subtitle: 'subtitle.text',
        xAxis: 'xAxis.title.text',
        yAxis: 'yAxis.title.text',
        stacking: 'plotOptions.series.stacking',
        legend: 'legend.enabled',
        suffix: 'tooltip.valueSuffix',
        prefix: 'tooltip.valuePrefix',
        series: 'series'
    };

    var Chart = controls.Control.extend({
        template: function() {},

        emptyView: base.EmptyView,

        loadView: base.LoadView,

        chartOptions: chartOptions.defaults,

        constructor: function(options) {
            _.bindAll(this, 'onChartLoaded');

            var chartOptions = _.extend({}, options.chart);
            if (chartOptions !== null) {
                var value;

                // Map convenience options to the real ones.
                for (var key in chartOptions) {
                    value = chartOptions[key];

                    if (OPTIONS_MAP[key]) {
                        this.setOption(OPTIONS_MAP[key], value);
                        delete chartOptions[key];
                    }
                }

                this.chartOptions = $.extend(true, {}, this.chartOptions, chartOptions);
            }

            if (typeof this.chartOptions.el === 'undefined' ||
                    typeof this.chartOptions.el === null) {
                this.chartOptions.el = this.el;
            }

            controls.Control.prototype.constructor.call(this, options);
        },

        // Convenience method for setting an option since the option hierarchy
        // is so large. The 'key' may use the dot-notion for accessing nested
        // structures.
        setOption: function(key, value) {
            var options = this.chartOptions,
                toks = key.split('.'),
                last = toks.pop();

            var tok;
            for (var i = 0; i < toks.length; i++) {
                tok = toks[i];

                if (options[tok] === null) {
                    options[tok] = {};
                }

                options = options[tok];
            }

            options[last] = value;
        },

        getChartOptions: function() {
            return this.chartOptions;
        },

        showEmptyView: function() {
            var view = new this.emptyView({
                message: 'No data is available for charting'
            });

            this.$el.html(view.render().el);
        },

        onChartLoaded: function() {
            this.$el.find('.load-view').remove();
        },

        renderChart: function(options) {
            this.initialize();

            var view = new this.loadView({
                message: 'Loading chart'
            });

            this.$el.append(view.render().el);

            options.chart.events = {
                load: this.onChartLoaded
            };

            if (this.chart) {
                if (typeof this.chart.destroy === 'function') {
                    this.chart.destroy();
                }
            }

            this.chart = new Highcharts.Chart(options);
        }

    });

    // Set a default option for the class.
    Chart.setDefaultOption = function(key, value) {
        var last, options, prev, prevTok, tok, toks;

        options = this.prototype.chartOptions = _.clone(this.prototype.chartOptions);

        toks = key.split('.');
        last = toks.pop();
        prev = null;
        prevTok = null;

        for (var i = 0; i < toks.length; i++) {
            tok = toks[i];
            prev = options;

            if (prev[tok] !== null && typeof prev[tok] !== 'undefined') {
                options = _.clone(prev[tok]);
            }
            else {
                options = {};
            }

            prev[tok] = options;
        }

        options[last] = value;
    };


    var AreaChart = Chart.extend({});
    AreaChart.setDefaultOption('chart.type', 'area');

    var AreaSplineChart = Chart.extend({});
    AreaSplineChart.setDefaultOption('chart.type', 'areaspline');

    var BarChart = Chart.extend({});
    BarChart.setDefaultOption('chart.type', 'bar');

    var ColumnChart = Chart.extend({});
    ColumnChart.setDefaultOption('chart.type', 'column');

    var LineChart = Chart.extend({});
    LineChart.setDefaultOption('chart.type', 'line');

    var PieChart = Chart.extend({});
    PieChart.setDefaultOption('chart.type', 'pie');
    PieChart.setDefaultOption('legend.enabled', true);

    var ScatterChart = Chart.extend({});
    ScatterChart.setDefaultOption('chart.type', 'scatter');

    var SplineChart = Chart.extend({});
    SplineChart.setDefaultOption('chart.type', 'spline');

    var Sparkline = Chart.extend({
        chartOptions: chartOptions.sparkline
    });

    var charts = {
        Chart: Chart,
        AreaChart: AreaChart,
        AreaSplineChart: AreaSplineChart,
        BarChart: BarChart,
        ColumnChart: ColumnChart,
        LineChart: LineChart,
        PieChart: PieChart,
        ScatterChart: ScatterChart,
        SplineChart: SplineChart,
        Sparkline: Sparkline
    };

    _.extend(Backbone, charts);

    return charts;
});
