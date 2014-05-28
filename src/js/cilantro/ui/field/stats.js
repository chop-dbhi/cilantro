/* global define */

define ([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    '../core',
    '../base',
    '../charts',
    '../charts/utils'
], function($, _, Backbone, Marionette, c, base, charts, utils) {

    // Prettifies a value for display
    var prettyValue = function (value) {
        if (_.isNumber(value)) {
            return c.utils.prettyNumber(value);
        }

        return value;
    };

    var FieldStatValue = Marionette.ItemView.extend({
        tagName: 'li',

        template: function (data) {
            /*
             * This is a map of data labels to display labels. For example, when
             * displaying data with a label of 'Distinct count', it will be rendered
             * as 'Unique values' when this field stat value is displayed in the page.
             * If a data label is not in this map, then the data label itself will
             * be used.
             */
            var statslabel = {
                min: 'Min',
                max: 'Max',
                avg: 'Average',
                count: 'Count',
                distinct_count: 'Unique values' // jshint ignore:line
            };
            return '<span class=stat-label>' + (statslabel[data.key] || data.key) +
                   '</span> <span class=stat-value title="' + data.value + '">' +
                   (prettyValue(data.value)) + '</span>';
        }
    });

    var FieldStatsValues = Marionette.CollectionView.extend({
        tagName: 'ul',

        itemView: FieldStatValue
    });

    var FieldStatsChart = charts.FieldChart.extend({ // jshint ignore:line
        className: 'sparkline',

        chartOptions: Backbone.Sparkline.prototype.chartOptions,

        getChartOptions: function (resp) {
            var options = {
                series: [utils.getSeries(resp.data)]
            };
            $.extend(true, options, this.chartOptions);
            options.chart.renderTo = this.ui.chart[0];
            return options;
        }
    });

    var FieldStats = Marionette.Layout.extend({
        className: 'field-stats',

        template: 'field/stats',

        regions: {
            values: '.stats-values',
            chart: '.stats-chart'
        },

        onRender: function() {
            if (this.model.stats) {
                this.values.show(new FieldStatsValues({
                    collection: this.model.stats
                }));

                if (!this.model.stats.length) {
                    this.model.stats.fetch({
                        reset: true
                    });
                }
            }
        }
    });

    return {
        FieldStats: FieldStats
    };

});
