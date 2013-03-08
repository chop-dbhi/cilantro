define [
    '../core'
    './dist'
    './axis'
    'tpl!templates/views/editable-chart.html'
], (c, dist, axis, templates...) ->

    templates = c._.object ['editable'], templates


    class EditableFieldChart extends dist.FieldChart
        template: templates.editable
    
        events: c._.extend
            'click .fullsize': 'toggleExpanded'
        , dist.FieldChart::events

        ui: c._.extend
            toolbar: '.btn-toolbar'
            fullsizeToggle: '.fullsize'
            form: '.editable'
            xAxis: '[name=x-Axis]'
            yAxis: '[name=y-Axis]'
            series: '[name=series]'
        , dist.FieldChart::ui

        onRender: ->
            if @options.editable is false
                @ui.form.detach()
                @ui.toolbar.detach()
            else
                # Form-related components
                @xAxis = new axis.FieldAxis
                    el: @ui.xAxis
                    collection: @collection

                @yAxis = new axis.FieldAxis
                    el: @ui.yAxis
                    collection: @collection

                @series = new axis.FieldAxis
                    el: @ui.series
                    enumerableOnly: true
                    collection: @collection

                if @model
                    if @model.get 'xAxis' then @ui.form.hide()
                    if (expanded = @model.get 'expanded') then @expand() else @contract()

        customizeOptions: (options) ->
            @ui.status.detach()

            @ui.heading.text options.title.text
            options.title.text = ''

            # Check if any data is present
            if not options.series[0]
                @ui.chart.html '<p class=no-data>Unfortunately, there is
                    no data to graph here.</p>'
                return

            @ui.form.hide()

            statusText = []
            if options.clustered
                statusText.push 'Clustered'

            if statusText[0]
                @ui.status.text(statusText.join(', ')).show()
                @ui.heading.append @$status

            if @interactive(options)
                @enableChartEvents()

            $.extend true, options, @chartOptions
            options.chart.renderTo = @ui.chart[0]

            return options


        # Ensure rapid successions of this method do not occur
        changeChart: (event) ->
            if event then event.preventDefault()

            @collection.when =>
                # TODO fix this nonsense
                if not event?
                    if (xAxis = @model.get 'xAxis')
                        @xAxis.$el.val xAxis.toString()
                    if (yAxis = @model.get 'yAxis')
                        @yAxis.$el.val yAxis.toString()
                    if (series = @model.get 'series')
                        @series.$el.val series.toString()

                xAxis = @xAxis.getSelected()
                yAxis = @yAxis.getSelected()
                series = @series.getSelected()

                if not xAxis then return

                url = @model.get('_links').distribution.href

                fields = [xAxis]
                data = 'dimension=' + xAxis.id

                if yAxis
                    fields.push yAxis
                    data = data + '&dimension=' + yAxis.id

                if series
                    seriesIdx = if yAxis then 2 else 1
                    data = data + '&dimension=' + series.id

                if event and @model
                    @model.set
                        xAxis: xAxis.id
                        yAxis: if yAxis then yAxis.id
                        series: if series then series.id

                @update url, data, fields, seriesIdx

        # Disable selected fields since using the same field for multiple
        # axes doesn't make sense
        disableSelected: (event) ->
            $target = $ event.target

            # Changed to an empty value, unhide other dropdowns
            if @xAxis.el is event.target
                @yAxis.$('option').prop('disabled', false)
                @series.$('option').prop('disabled', false)
            else if @yAxis.el is event.target
                @xAxis.$('option').prop('disabled', false)
                @series.$('option').prop('disabled', false)
            else
                @xAxis.$('option').prop('disabled', false)
                @yAxis.$('option').prop('disabled', false)

            if (value = $target.val()) isnt ''
                if @xAxis.el is event.target
                    @yAxis.$("option[value=#{ value }]").prop('disabled', true).val('')
                    @series.$("option[value=#{ value }]").prop('disabled', true).val('')
                else if @yAxis.el is event.target
                    @xAxis.$("option[value=#{ value }]").prop('disabled', true).val('')
                    @series.$("option[value=#{ value }]").prop('disabled', true).val('')
                else
                    @xAxis.$("option[value=#{ value }]").prop('disabled', true).val('')
                    @yAxis.$("option[value=#{ value }]").prop('disabled', true).val('')

        toggleExpanded: (event) ->
            expanded = @model.get 'expanded'
            if expanded then @contract() else @expand()
            @model.save expanded: not expanded

        resize: ->
            chartWidth = @ui.chart.width()
            if @chart then @chart.setSize chartWidth, null, false

        expand: ->
            @$fullsizeToggle.children('i')
                .removeClass('icon-resize-small')
                .addClass('icon-resize-full')
            @$el.addClass 'expanded'
            @resize()

        contract: ->
            @$fullsizeToggle.children('i')
                .removeClass('icon-resize-full')
                .addClass('icon-resize-small')
            @$el.removeClass 'expanded'
            @resize()

        hideToolbar: ->
            @ui.toolbar.fadeOut 200

        showToolbar: ->
            @ui.toolbar.fadeIn 200

        toggleEdit: (event) ->
            if @ui.form.is(':visible') then @ui.form.fadeOut 300 else @ui.form.fadeIn 300


    { EditableFieldChart }
