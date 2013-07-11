define [
    '../core'
], (c) ->

    # MAX_RADIUS = 10
    # MIN_RADIUS = 3

    getColor = (idx) ->
        colors = c.Highcharts.getOptions().colors
        return colors[idx % colors.length]


    dateRegexp = /\d{4}-\d{2]-\d{2]/


    parseDate = (str) ->
        year = parseInt(str.substr(0, 4))
        month = parseInt(str.substr(5, 2)) - 1
        day = parseInt(str.substr(8, 2))
        Date.UTC(year, month, day)

    processResponse = (resp, fields, seriesIdx) ->
        if fields.length > 2
            throw new Error '3-dimensional charts are not supported.
                Specify which field the series applies to.'
        else if not fields
            throw new Error 'The field instances must be supplied'

        xLabels = []
        yLabels = []

        # Check whether the y-axis consists of enumerable data, otherwise
        # fallback to true for standard counts
        [xField, yField] = fields

        xName = xField.get 'name'
        xEnum = xField.get('enumerable') or xField.get('simple_type') is 'boolean'
        xType = if xField.get('simple_type') is 'date' then 'datetime' else 'linear'

        if yField
            yName = yField.get 'name'
            yEnum = yField.get('enumerable') or yField.get('simple_type') is 'boolean'
            yType = if yField.get('simple_type') is 'date' then 'datetime' else 'linear'
        else
            yName = 'Frequency'
            yEnum = false
            yType = 'linear'

        if xEnum and yEnum
            chartType = 'scatter'
            xLabels.push ' '
            yLabels.push ' '
        else if yField and not xEnum and not yEnum
            chartType = 'scatter'
        else if yEnum
            chartType = 'scatter'
        else if xType is 'datetime' or yType is 'datetime'
            chartType = 'line'
        else
            chartType = 'column'

        seriesData = {}

        clustered = resp.clustered

        # Perform the group by first prior to building each series
        for point, i in resp.data
            if seriesIdx?
                svalue = point.values.slice(seriesIdx, seriesIdx+1)[0]
            else
                svalue = ''

            # Initial setup
            if not (series = seriesData[svalue])
                series = seriesData[svalue] =
                    name: svalue
                    stats:
                        min: point.count
                        max: point.count
                        sum: point.count
                if xEnum and yEnum
                    series.data = [{ x: 0, y: 0, radius: 0, sentinel: true }, point]
                else
                    series.data = [point]
            else
                # Add it to the corresponding seriesData
                series.data.push point
                series.stats.min = Math.min series.stats.min, point.count
                series.stats.max = Math.max series.stats.max, point.count
                series.stats.sum += point.count

            x = point.values[0]
            if x is null then x = '(no data)'

            if xEnum
                if (idx = xLabels.indexOf x.toString()) is - 1
                    idx = xLabels.push(x.toString()) - 1
                x = idx
            else
                if xType is 'datetime'
                    x = parseDate x

            if yField
                y = point.values[1]
                if y is null then y = '(no data)'
                if yEnum
                    if (idx = yLabels.indexOf y.toString()) is - 1
                        idx = yLabels.push(y.toString()) - 1
                    y = idx
                else
                    if yType is 'datetime'
                        y = parseDate y
            else
                # Handle other aggregations here?
                y = point.count

            point.x = x
            point.y = y

        # Turn into a list
        seriesList = []

        if xEnum and yEnum
            xlen = xLabels.push(' ') - 1
            ylen = yLabels.push(' ') - 1

        seriesNo = 0
        for name, series of seriesData
            if xEnum and yEnum
                series.data.push x: 0, y: ylen, radius: 0, sentinel: true
                series.data.push x: xlen, y: ylen, radius: 0, sentinel: true
                series.data.push x: xlen, y: ylen, radius: 0, sentinel: true

            seriesList.push series
            avg = series.stats.avg = series.stats.sum / parseFloat(series.data.length, 10)
            max = series.stats.max
            if chartType is 'scatter'
                for p in series.data
                    if p.sentinel then continue
                    norm = Math.min(Math.max(parseInt(parseFloat(p.count, 10) / avg * 5) / 10, 0.05), 1)
#                    radius = Math.min(Math.max(MIN_RADIUS, parseFloat(p.count, 10) / avg * 5), MAX_RADIUS)
                    color = c.Highcharts.Color(getColor seriesNo).setOpacity(norm)
                    p.marker = fillColor: color.get()
                    if xEnum
                        p.marker.radius = 7
            seriesNo++

        # TODO: This is really ugly, clean up the code that creates and 
        # returns the formatter.
        if chartType is 'scatter' and xEnum
            # Multiple series
            if seriesList[1]
                formatterFunc = ->
                    return "<h5>#{ @series.name }</h5><br /><b>#{ xName }:</b> #{ @series.xAxis.categories[@point.x] }<br /><b>#{ yName }:</b> #{ @series.yAxis.categories[@point.y] }"
            else
                formatterFunc = ->
                    return "<b>#{ xName }:</b> #{ @series.xAxis.categories[@point.x] }<br /><b>#{ yName }:</b> #{ @series.yAxis.categories[@point.y] }"
        else if chartType is 'column' and xEnum
            # Multiple series
            if seriesList[1]
                formatterFunc = ->
                    return "<h5>#{ @series.name }</h5><br /><b>#{ xName }:</b> #{ @series.xAxis.categories[@point.x] }<br /><b>#{ yName }:</b> #{ c.Highcharts.numberFormat parseFloat @y }"
            else
                formatterFunc = ->
                    return "<b>#{ xName }:</b> #{ @series.xAxis.categories[@point.x] }<br /><b>#{ yName }:</b> #{ c.Highcharts.numberFormat parseFloat @y }"
        else
            # Multiple series
            if seriesList[1]
                formatterFunc = ->
                    return "<h5>#{ @series.name }</h5><br /><b>#{ xName }:</b> #{ c.Highcharts.numberFormat parseFloat @x }<br /><b>#{ yName }:</b> #{ c.Highcharts.numberFormat parseFloat @y }"
            else
                formatterFunc = ->
                    return "<b>#{ xName }:</b> #{ c.Highcharts.numberFormat parseFloat @x }<br /><b>#{ yName }:</b> #{ c.Highcharts.numberFormat parseFloat @y }"

        options = {
            clustered: clustered
            chart:
                type: chartType
            title:
                text: if yField then "#{ xName } vs. #{ yName }" else "#{ xName } #{ yName }"
            series: seriesList
            xAxis:
                title:
                    text: xName
                type: xType
            yAxis:
                title:
                    text: yName
                type: yType
            tooltip:
                formatter: formatterFunc
        }

        if xLabels.length
            options.xAxis.categories = xLabels
        if yLabels.length
            options.yAxis.categories = yLabels

        if not seriesList[1]
            options.legend = enabled: false

        if chartType is 'scatter'
            options.yAxis.gridLineWidth = 0
            if not xEnum
                options.chart.zoomType = 'xy'

        return options

    # Simple parser to format for use by Highcharts
    getSeries = (data) ->
        points = []

        for datum in data
            point = c._.clone datum
            point.x = datum.values[0]
            if datum.values[1]?
                point.y = datum.values[1]
            else
                point.y = datum.count
            points.push point

        return data: c._.sortBy points, 'x'


    { processResponse, getSeries }
