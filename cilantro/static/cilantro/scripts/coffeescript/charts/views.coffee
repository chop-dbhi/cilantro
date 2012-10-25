define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'
    './utils'
    './backbone-charts'
], (environ, mediator, $, _, Backbone, utils) ->

    chartTmpl = _.template '
        <div class="area-container chart-container">
            <div class=btn-toolbar>
                <div class=btn-group>
                    <button class="btn btn-mini fullsize" title="Toggle Fullsize"><i class=icon-resize-full alt="Toggle Fullsize"></i></button>
                    <!--<button class="btn btn-mini outliers" title="Show Outliers" disabled><i class=icon-eye-open alt="Show Outliers"></i></button>-->
                </div>
                <div class=btn-group>
                    <button class="btn btn-mini edit" title="Edit"><i class=icon-wrench alt="Edit"></i></button>
                </div>
                <div class=btn-group>
                    <button class="btn btn-danger btn-mini remove" title="Remove"><i class=icon-remove alt="Remove"></i></button>
                </div>
            </div>
            <div class=heading>
                <span class="label label-info"></span>
            </div>
            <div class=editable>
                <form class=form>
                    <fieldset>
                        <label>X-Axis <select name=x-axis></select></label>
                        <label>Y-Axis <select name=y-axis></select></label>
                        <label>Series <select name=series></select></label>
                        <button class="btn btn-primary">Update</button>
                    </fieldset>
                </form>
            </div>
            <div class=chart>
            </div>
        </div>
    '


    # Represents a list of possible fields for use with a distribution chart
    class DataFieldDistribution extends Backbone.View
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


    class DistributionChart extends Backbone.Chart
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

        initialize: ->
            super

            @setElement chartTmpl()

            @$heading = @$ '.heading'
            @$label = @$heading.find '.label'
            @$renderArea = @$ '.chart'
            @$toolbar = @$ '.btn-toolbar'
            @$fullsizeToggle = @$ '.fullsize'
            @$form = @$ '.editable'

            if @options.editable is false
                @$form.detach()
                @$toolbar.detach()
            else
                # Form-related components
                @xAxis = new DataFieldDistribution
                    el: @$el.find '[name=x-axis]'
                    collection: @collection

                @yAxis = new DataFieldDistribution
                    el: @$el.find '[name=y-axis]'
                    collection: @collection

                @series = new DataFieldDistribution
                    el: @$el.find '[name=series]'
                    enumerableOnly: true
                    collection: @collection

                if @model
                    if @model.get 'xAxis' then @$form.hide()
                    if (expanded = @model.get 'expanded') then @expand() else @contract()

        render: -> @$el

        renderChart: (options) ->
            if @chart then @chart.destroy?()
            @$label.detach()

            @$heading.text options.title.text
            options.title.text = ''

            # Check if any data is present
            if not options.series[0]
                @$renderArea.html '<p class=no-data>Unfortunately, there is
                    no data to graph here.</p>'
                return

            @$form.hide()

            labelText = []
            if options.clustered
                labelText.push 'Clustered'

            if labelText[0]
                @$label.text(labelText.join(', ')).show()
                @$heading.append @$label

            $.extend true, options, @chartOptions
            options.chart.renderTo = @$renderArea[0]
            @chart = new Highcharts.Chart options
            return @

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
            chartWidth = @$renderArea.width()
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
            @$toolbar.fadeOut 200

        showToolbar: ->
            @$toolbar.fadeIn 200

        # Toggles between showing the outliers and hiding the outliers
        # on the chart if any are present. The button will be greayed out
        # if none are available.
        toggleOutliers: (event) ->
            for series in @chart.series
                continue

        toggleEdit: (event) ->
            if @$form.is(':visible') then @$form.fadeOut 300 else @$form.fadeIn 300

        removeChart: (event) ->
            if @chart then @chart.destroy?()
            @$el.remove()
            if @model then @model.destroy()

        update: (url, data, fields, seriesIdx) ->
            if @options.data
                for key, value of @options.data
                    if not data
                        data = "#{key}=#{value}"
                    else
                        data = data + "&#{key}=#{value}"

            @$el.addClass 'loading'
            Backbone.ajax
                url: url
                data: data
                success: (resp) =>
                    @$el.removeClass 'loading'
                    @renderChart utils.processResponse resp, fields, seriesIdx

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


    { DistributionChart }
