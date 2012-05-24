define ['environ', 'jquery', 'use!backbone', 'charts/utils', 'backbone.charts'], (eviron, $, Backbone, utils) ->

    urlTmpl = _.template '/api/fields/{{ id }}/dist/'

    chartTmpl = _.template '
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
        <div class=heading></div>
        <div class=editable>
            <form class=form-inline>
                <label>X-Axis <select name=x-axis></select></label>
                <label>Y-Axis <select name=y-axis></select></label>
                <label>Series <select name=series></select></label>
                <button class="btn btn-primary">Update</button>
            </form>
        </div>
        <div class=chart></div>
    '


    class DataFieldDistribution extends Backbone.View
        tagName: 'select'

        initialize: (options) ->
            @enumerableOnly = options.enumerableOnly
            @collection.on 'reset', @render
            # Render if already populated
            if @collection.models[0] then @render()

        render: ->
            @$el.append '<option value=>---</option>'

            for model in @collection.models
                # No good way to represent large string-based yet
#                if (data = model.get('data')).searchable
#                    continue
                data = model.get('data')
                if @enumerableOnly and not data.enumerable
                    continue
                @$el.append "<option value=#{ model.id }>#{ model.get 'name' } [#{ model.get 'model_name' }]</option>"
            return

        getSelected: ->
            return @collection.get parseInt @$el.val()


    class DistributionChart extends Backbone.Chart
        className: 'area-container chart-container'

        events:
            # Toolbar
            'mouseenter': 'showToolbar'
            'mouseleave': 'hideToolbar'
            'click .fullsize': 'toggleFullsize'
            'click .outliers': 'toggleOutliers'
            'click .edit': 'toggleEdit'
            'click .remove': 'removeChart'

            # Edit form
            'submit': 'updateChart'

        initialize: (options) ->
            @$el.html (contents = $ chartTmpl())
            @clusterLabel =  $ '<span class="label label-info">Clustered</span>'

            @heading = @$el.find '.heading'
            @renderArea = @$el.find '.chart'
            @toolbar = @$el.find '.btn-toolbar'
            @fullsizeToggle = @$el.find '.fullsize'

            if options and options.editable is false
                @$('.editable').detach()
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

            @delegateEvents()

        render: (options) ->
            if @chart then @chart.destroy()
            @clusterLabel.hide().detach()

            # Set the chart title in the
            @heading.text options.title.text
            options.title.text = ''

            # Check if any data is present
            if not options.series[0]
                @renderArea.html '<h3 class=no-data>One or more of the selected
                    dimensions does not contain any data. Please change your selection.</h3>'
                return

            @$('.editable').hide()
            if options.clustered
                @heading.append ' '
                @heading.append @clusterLabel.show()

            $.extend true, options, @chartOptions
            options.chart.renderTo = @renderArea[0]
            @chart = new Highcharts.Chart options

        toggleFullsize: ->
            @fullsizeToggle.children('i').toggleClass('icon-resize-full icon-resize-small')

            if @$el.hasClass 'expanded'
                @fullsize = false
                @$el.removeClass 'expanded'
            else
                @fullsize = true
                @$el.addClass 'expanded'
            chartWidth = @renderArea.width()
            if @chart then @chart.setSize chartWidth, null, false

        hideToolbar: ->
            @toolbar.fadeOut 200

        showToolbar: ->
            @toolbar.fadeIn 200


        # Toggles between showing the outliers and hiding the outliers
        # on the chart if any are present. The button will be greayed out
        # if none are available.
        toggleOutliers: (event) ->
            for series in @chart.series
                continue

        toggleEdit: (event) ->
            target = @$ '.editable'
            if target.is(':visible') then target.slideUp 300 else target.slideDown 300

        removeChart: (event) ->
            if @chart then @chart.destroy()
            @$el.remove()
            if @model then @model.destroy()


        renderChart: (url, data, fields, seriesIdx) ->
            Backbone.ajax
                url: url
                data: data
                beforeSend: =>
                    @renderArea.addClass 'loading'

                success: (resp) =>
                    @renderArea.removeClass 'loading'
                    options = utils.processResponse resp, fields, seriesIdx
                    @render options

        updateChart: (event) ->
            event.preventDefault()

            x = @xAxis.getSelected()
            y = @yAxis.getSelected()
            c = @series.getSelected()

            if not x then return
            url = urlTmpl id: x.id

            fields = []
            data = ''

            if x
                fields.push x
                data += 'dimension=' + x.id + '&'
            if y
                fields.push y
                data += 'dimension=' + y.id + '&'
            if c
                seriesIdx = if y then 2 else 1
                data += 'dimension=' + c.id

            @renderChart url, data, fields, seriesIdx


    { Distribution: DistributionChart }
