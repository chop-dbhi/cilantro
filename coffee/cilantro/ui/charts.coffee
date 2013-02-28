define [
    './core'
    './charts/utils'
    'tpl!templates/views/chart.html'
], (c, utils, chartTmpl) ->

    # Represents a list of possible fields for use with a distribution chart
    class FieldAxis extends c.Marionette.ItemView
        tagName: 'select'

        options:
            enumerableOnly: false

        initialize: ->
            @collection.when @render

        render: =>
            @$el.append '<option value=>---</option>'

            for model in @collection.models
                # No good way to represent large string-based yet
                if model.get 'searchable' then continue
                if @options.enumerableOnly and not model.get 'enumerable'
                    continue
                @$el.append "<option value=\"#{ model.id }\">#{ model.get 'name' }</option>"
            return @$el

        getSelected: ->
            @collection.get parseInt @$el.val()


    class FieldDistributionChart extends c.Backbone.Chart
        options:
            editable: true

        events:
            # Toolbar
            'mouseenter': 'showToolbar'
            'mouseleave': 'hideToolbar'
            'click .fullsize': 'toggleExpanded'
            'click .outliers': 'toggleOutliers'
            'click .edit': 'toggleEdit'
            'click .remove': 'removeChart'

            # Edit form
            'submit': 'changeChart'
            'change .editable select': 'disableSelected'
        ui: 
            'heading': '.heading'
            'label' : '.heading .label'
            'renderArea': '.chart'
            'toolbar': '.btn-toolbar'
            'fullsizeToggle': '.fullsize'
            'form': '.editable'
            'xAxis': '[name=x-Axis]'
            'yAxis': '[name=y-Axis]'
            'series': '[name=series]'


        initialize: ->
            super
            @setElement(@template(@model))

            # Explicitly set our width to a specified parentView in case the DOM 
            # hiearchy is not yet in place
            @ui.renderArea.width(@options.parentView.$el.width()) /
                if @options.parentView?


            if @options.editable is false
                @ui.form.detach()
                @ui.toolbar.detach()
            else
                # Form-related components
                @xAxis = new FieldAxis
                    el: @ui.xAxis
                    collection: @collection

                @yAxis = new FieldAxis
                    el: @ui.yAxis
                    collection: @collection

                @series = new FieldAxis
                    el: @ui.series
                    enumerableOnly: true
                    collection: @collection

                if @model
                    if @model.get 'xAxis' then @ui.form.hide()
                    if (expanded = @model.get 'expanded') then @expand() else @contract()

        enableChartEvents: ->
            @setOption('plotOptions.series.events.click', @chartClick)

        chartClick: (event) =>
            category = event.point.category ? event.point.name
            event.point.select(not event.point.selected, true)
            @node = new Serrano.ContextNode @get()
            c.publish "context.#{ @model.id }/edit", @node

        interactive: (options) ->
            if (type = options.chart?.type) is 'pie'
                return true
            else if type is 'column' and options.xAxis.categories?
                return true
            return false

        getValue: (options) ->
            points = @chart.getSelectPoints()
            return (point.category for point in points)

        getOperator: -> 'in'

        render: ->
            if @chart then @chart.destroy?()
            @update()
            return @$el

        customizeOptions: (options) ->
            @ui.label.detach()

            @ui.heading.text options.title.text
            options.title.text = ''

            # Check if any data is present
            if not options.series[0]
                @ui.renderArea.html '<p class=no-data>Unfortunately, there is
                    no data to graph here.</p>'
                return

            @ui.form.hide()

            labelText = []
            if options.clustered
                labelText.push 'Clustered'

            if labelText[0]
                @ui.label.text(labelText.join(', ')).show()
                @ui.heading.append @$label

            if @interactive(options)
                @enableChartEvents()

            $.extend true, options, @chartOptions
            options.chart.renderTo = @ui.renderArea[0]

            return options

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
            chartWidth = @ui.renderArea.width()
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

        # Toggles between showing the outliers and hiding the outliers
        # on the chart if any are present. The button will be greayed out
        # if none are available.
        toggleOutliers: (event) ->
            for series in @chart.series
                continue

        toggleEdit: (event) ->
            if @ui.form.is(':visible') then @ui.form.fadeOut 300 else @ui.form.fadeIn 300

        removeChart: (event) ->
            if @chart then @chart.destroy?()
            @$el.remove()
            if @model then @model.destroy()

        update:  ->
            @$el.addClass 'loading'
            @model.distribution (resp) =>
                    @$el.removeClass 'loading'
                    @chart = new Highcharts.Chart(@customizeOptions utils.processResponse resp, [@model])

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
        template: chartTmpl


    { FieldDistributionChart }
