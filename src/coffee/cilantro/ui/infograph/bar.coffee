define [
    'underscore'
    'backbone'
    'marionette'
    '../controls'
    '../button'
    'tpl!templates/infograph/bar.html'
    'tpl!templates/infograph/bar-chart-toolbar.html'
    'tpl!templates/infograph/bar-chart.html'
], (_, Backbone, Marionette, controls, button, templates...) ->

    templates = _.object ['bar', 'toolbar', 'chart'], templates


    class BarModel extends Backbone.Model
        parse: (attrs) ->
            attrs.value = attrs.values[0]
            return attrs


    sortModelAttr = (attr) ->
        (model) ->
            value = model.get(attr)
            if _.isString(value)
                value = value.toLowerCase()
            return value


    class BarCollection extends Backbone.Collection
        model: BarModel

        comparator: (model) ->
            -model.get('count')

        sortModelsBy: (attr) ->
            if (reverse = attr.charAt(0) is '-')
                attr = attr.slice(1)
            @models = @sortBy(sortModelAttr(attr))
            if reverse then @models.reverse()
            @trigger 'sort', @
            return


    class Bar extends Marionette.ItemView
        className: 'info-bar'

        template: templates.bar

        options:
            total: null

        ui:
            bar: '.bar'

        events:
            'click': 'toggleSelected'

        modelEvents:
            'change:selected': 'setSelected'
            'change:visible': 'setVisible'

        serializeData: ->
            attrs = @model.toJSON()
            attrs.value = attrs.values[0]
            percentage = @getPercentage()
            attrs.width = percentage
            if percentage < 1
                attrs.percentage = '<1'
            else
                attrs.percentage = parseInt(percentage)
            return attrs

        onRender: ->
            @setSelected(@model, !!@model.get('selected'))

        getPercentage: ->
            @model.get('count') / @options.total * 100

        toggleSelected: (event) ->
            @model.set('selected', not @model.get('selected'))

        setSelected: (model, value) ->
            @$el.toggleClass('selected', value)
            # If a delect occurs while a bar is selected, this ensures it
            # is now hidden
            if not value and model.get('visible') is false
                @$el.removeClass('filtered').hide()

        setVisible: (model, value) ->
            if value
                @$el.removeClass('filtered').show()
            else if model.get('selected')
                @$el.addClass('filtered')
            else
                @$el.hide()


    # Renders a series of bars for each value. This contains the value,
    # count and percentage for the value.
    class Bars extends Marionette.CollectionView
        className: 'info-bar-chart'

        itemView: Bar

        itemViewOptions: (model, index) ->
            model: model
            total: @calcTotal()

        collectionEvents:
            'change': 'change'
            'sort': 'sortChildren'

        constructor: (options) ->
            options.collection ?= new BarCollection
            @bindContext(options.context)
            super(options)

        initialize: ->
            # Fetch the field distribution, do not cache
            @model.distribution (resp) =>
                @collection.reset(resp.data, parse: true)
                @setValue(@context.get('value'))

        # Sums the total count across all values
        calcTotal: ->
            total = 0
            total += count for count in @collection.pluck('count')
            return total

        onRender: ->
            @set(@getContext())

        # Sorts the children based the on the current order of the collection
        sortChildren: (collection, options) ->
            # Iterates over the newly sorted models and re-appends the
            # child views relative to the new indexes
            @collection.each (model) =>
                view = @children.findByModel(model)
                @$el.append(view.el)
            return

        getField: -> @model.id

        getOperator: -> 'in'

        getValue: ->
            _.map @collection.where(selected: true), (model) ->
                model.get('value')

        setValue: (values=[]) ->
            # Toggle the selection based on the presence values
            @collection.each (model) ->
                model.set('selected', model.get('value') in values)
            return


    _.defaults Bars::, controls.ControlViewMixin


    class BarChartToolbar extends Marionette.ItemView
        className: 'navbar navbar-toolbar'

        template: templates.toolbar

        events:
            'change .btn-select': 'sortBy'
            'keyup [name=filter]': 'filterBars'
            'click [name=invert]': 'invertSelection'

        ui:
            toolbar: '.btn-toolbar'
            sortSelect: '.btn-select'
            filterInput: '[name=filter]'
            invertButton: '[name=invert]'

        onRender: ->
            @sortSelect = new button.ButtonSelect
                collection: [
                    value: '-count'
                    label: 'Count (desc)'
                    selected: true
                ,
                    value: 'count'
                    label: 'Count (asc)'
                ,
                    value: '-value'
                    label: 'Value (desc)'
                ,
                    value: 'value'
                    label: 'Value (asc)'
                ]

            @sortSelect.render()
            @sortSelect.$el.addClass('pull-right')
            @ui.toolbar.append(@sortSelect.el)

        # Sorts the collection based on the current selected value
        sortBy: (event) ->
            @collection.sortModelsBy(@sortSelect.getSelection())

        # 'Filters' the bars given the input
        filterBars: (event) ->
            event.stopPropagation()

            text = @ui.filterInput.val()
            regex = new RegExp(text, 'i')

            @collection.each (model) ->
                model.set('visible', not text or regex.test(model.get('value')))
            return

        # Inverts the selected bars. If the bar is not visible and not
        # selected it will not be inverted.
        invertSelection: (event) ->
            @collection.each (model) ->
                if model.get('visible') isnt false or model.get('selected')
                    model.set('selected', not model.get('selected'))
            @collection.trigger('change')
            return



    class BarChart extends controls.Control
        template: templates.chart

        options:
            minValuesForToolbar: 10

        regions:
            toolbar: '.toolbar-region'
            bars: '.bars-region'

        collectionEvents:
            'reset': 'toggleToolbar'

        constructor: (options) ->
            options.collection ?= new BarCollection
            super(options)

        toggleToolbar: =>
            # Not yet rendered, this will be called again in onRender
            if not @toolbar.currentView then return
            @toolbar.currentView.$el.toggle(@collection.length >= @options.minValuesForToolbar)

        onRender: ->
            @bars.show new Bars
                model: @model
                context: @context
                collection: @collection

            @toolbar.show new BarChartToolbar
                collection: @collection

            @toggleToolbar()

    { BarChart }
