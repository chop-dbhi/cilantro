/* global define */

define([
    'underscore',
    'highcharts'
], function(_, Highcharts) {

    var getColor = function(idx) {
        var colors = Highcharts.getOptions().colors;
        return colors[idx % colors.length];
    };

    var parseDate = function(str) {
        var year = parseInt(str.substr(0, 4));
        var month = parseInt(str.substr(5, 2)) -1;
        var day = parseInt(str.substr(8, 2));

        return Date.UTC(year, month, day);
    };

    var processResponse = function(resp, fields, seriesIdx) {
        if (fields.length > 2) {
            throw new Error('3-dimensional charts are not supported.' +
                            'Specify which field the series applies to.');
        }
        else if (!fields) {
            throw new Error('The field instances must be supplied');
        }

        var xLabels = [],
            yLabels = [];

        // Check whether the y-axis consists of enumerable data, otherwise
        // fallback to true for standard counts.
        var xField = fields[0],
            yField = fields[1];

        var xName, xEnum, xType, yName, yEnum, yType, chartType;

        xName = xField.get('name');
        xEnum = xField.get('enumerable') ||
            xField.get('simple_type') === 'boolean';

        xType = xField.get('simple_type') === 'date' ? 'datetime' : 'linear';

        if (yField) {
            yName = yField.get('name');
            yEnum = yField.get('enumerable') ||
                yField.get('simple_type') === 'boolean';

            yType = yField.get('simple_type') === 'date' ? 'datetime' : 'linear';
        }
        else {
            yName = 'Frequency';
            yEnum = false;
            yType = 'linear';
        }

        if (xEnum && yEnum) {
            chartType = 'scatter';
            xLabels.push(' ');
            yLabels.push(' ');
        }
        else if (yField && !xEnum && !yEnum) {
            chartType = 'scatter';
        }
        else if (yEnum) {
            chartType = 'scatter';
        }
        else {
            chartType = 'column';
        }

        var seriesData = {},
            clustered = resp.clustered,
            respData = resp.data,
            point,
            svalue,
            series;

        // Perform the group by first prior to building each series.
        for (var i = 0; i < respData.length; i++) {
            point = respData[i];

            if (seriesIdx) {
                svalue = point.values.slice(seriesIdx, seriesIdx + 1)[0];
            }
            else {
                svalue = '';
            }

            if (!(series = seriesData[svalue])) {
                series = seriesData[svalue] = {
                    name: svalue,
                    stats: {
                        min: point.count,
                        max: point.count,
                        sum: point.count
                    }
                };

                if (xEnum && yEnum) {
                    series.data = [{x: 0, y: 0, radius: 0, sentinel: true}, point];
                }
                else {
                    series.data = [point];
                }
            }
            else {
                // Add it to the corresponding seriesData.
                series.data.push(point);
                series.stats.min = Math.min(series.stats.min, point.count);
                series.stats.max = Math.max(series.stats.max, point.count);
                series.stats.sum += point.count;
            }

            var x = point.values[0];
            if (x === null) {
                x = '(no data)';
            }

            if (xEnum) {
                if (xLabels.indexOf(x.toString()) === -1) {
                    x = xLabels.push(x.toString()) - 1;
                }
            }
            else if (xType === 'datetime'){
                x = parseDate(x);
            }

            var y;
            if (yField) {
                y = point.values[1];

                if (y === null) {
                    y = '(no data)';
                }

                if (yEnum) {
                    if (yLabels.indexOf(y.toString()) === -1) { // jshint ignore:line
                        y = yLabels.push(y.toString()) - 1;
                    }
                }
                else if (yType === 'datetime') {
                        y = parseDate(y);
                }
            }
            else {
                y = point.count;
            }

            point.x = x;
            point.y = y;
        }

        var seriesList = [];

        var xlen, ylen;

        if (xEnum && yEnum) {
            xlen = xLabels.push(' ') - 1;
            ylen = yLabels.push(' ') - 1;
        }

        var seriesNo = 0;
        for (var name in seriesData) {
            series = seriesData[name];

            if (xEnum && yEnum) {
                series.data.push({
                    x: 0,
                    y: ylen,
                    radius: 0,
                    sentinel: true
                });

                series.data.push({
                    x: xlen,
                    y: ylen,
                    radius: 0,
                    sentinel: true
                });

                series.data.push({
                    x: xlen,
                    y: ylen,
                    radius: 0,
                    sentinel: true
                });
            }

            seriesList.push(series);

            var avg = series.stats.avg = series.stats.sum /
                parseFloat(series.data.length, 10);

            if (chartType === 'scatter') {
                for (var i = 0; i < series.data.length; i++) { // jshint ignore:line
                    var p = series.data[i];

                    if (p.sentinel) { // jshint ignore:line
                        continue;
                    }

                    var norm = Math.min(Math.max(parseInt(
                                    parseFloat(p.count, 10) / avg * 5) / 10, 0.05), 1);
                    var color = Highcharts.Color(getColor(seriesNo)).setOpacity(norm);

                    p.marker = {
                        fillColor: color.get()
                    };

                    if (xEnum) { // jshint ignore:line
                        p.marker.radius = 7;
                    }
                }
            }

            seriesNo++;
        }

        // TODO: This is really ugly, clean up the code that creates and
        // returns the formatter.
        var formatterFunc;
        if (chartType === 'scatter' && xEnum) {
            // Multiple series
            if (seriesList[1]) {
                formatterFunc = function () {
                    return '<h5>' + this.series.name + '</h5><br /><b>' + xName +
                           ':</b>' + this.series.xAxis.categories[this.point.x] +
                           '<br /><b>' + yName + ':</b>' +
                           this.series.yAxis.categories[this.point.y];
                };
            }
            else {
                formatterFunc = function() {
                    return '<b>' + xName + ':</b>' +
                           this.series.xAxis.categories[this.point.x] + '<br /><b>' +
                           yName + ':</b>' + this.series.yAxis.categories[this.point.y];
                };
            }
        }
        else if (chartType === 'column' && xEnum) {
            // Multiple series
            if (seriesList[1]) {
               formatterFunc = function() {
                    return '<h5>' + this.series.name + '</h5><br /><b>' + xName +
                           ':</b>' + this.series.xAxis.categories[this.point.x] +
                           '<br /><b>' + yName + ':</b>' +
                           Highcharts.numberFormat(parseFloat(this.y));
                };
            }
            else {
                formatterFunc = function() {
                    return '<b>' + xName + ':</b>' +
                           this.series.xAxis.categories[this.point.x] + '<br /><b>' +
                           yName + ':</b>' + Highcharts.numberFormat(parseFloat(this.y));
                };
            }
        }
        else {
            // Multiple series
            if (seriesList[1]) {
                formatterFunc = function() {
                    return '<h5>' + this.series.name + '</h5><br /><b>' + xName +
                           ':</b>' + Highcharts.numberFormat(parseFloat(this.x)) +
                           '<br /><b>' + yName + ':</b>' +
                           Highcharts.numberFormat(parseFloat(this.y));
                };
            }
            else {
                formatterFunc = function() {
                    return '<b>' + xName + ':</b>' +
                           Highcharts.numberFormat(parseFloat(this.x)) + '<br /><b>' +
                           yName + ':</b>' + Highcharts.numberFormat(parseFloat(this.y));
                };
            }
        }

        var options = {
            clustered: clustered,
            chart: {
                type: chartType
            },
            title: {
                text: yField ? '' + xName + ' vs. ' + yName : '' + xName + ' ' + yName
            },
            series: seriesList,
            xAxis: {
                title: {
                  text: xName
                },
                type: xType
            },
            yAxis: {
                title: {
                  text: yName
                },
                type: yType
            },
            tooltip: {
                formatter: formatterFunc
            }
        };

        if (xLabels.length) {
            options.xAxis.categories = xLabels;
        }

        if (yLabels.length) {
            options.yAxis.categories = yLabels;
        }

        if (!seriesList[1]) {
            options.legend = {enabled: false};
        }

        if (chartType === 'scatter') {
            options.yAxis.gridLineWidth = 0;

            if (!xEnum) {
                options.chart.zoomType = 'xy';
            }
        }

        return options;
    };

    // Simple parser to format data for use by Highcharts.
    var getSeries = function(data) {
        var points = [],
            point,
            datum;

        for (var i = 0; i < data.length; i++) {
            datum = data[i];

            point = _.clone(datum);
            point.x = datum.values[0];

            if (datum.values[1] !== null) {
                point.y = datum.values[1];
            }
            else {
                point.y = datum.count;
            }

            points.push(point);
        }

        return {data: _.sortBy(points, 'x')};
    };


    return {
        processResponse: processResponse,
        getSeries: getSeries
    };

});
