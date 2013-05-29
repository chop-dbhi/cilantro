define [
    '../core'
    '../controls'
    'tpl!templates/infograph/bar-chart.html'
    'tpl!templates/infograph/bar.html'
], (c, controls, templates...) ->

    templates = c._.object ['chart', 'bar'], templates


    class BarModel extends c.Backbone.Model
        parse: (attrs) ->
            attrs.label = attrs.values[0]
            return attrs


    class BarCollection extends c.Backbone.Collection
        model: BarModel

        comparator: (model) ->
            -model.get('count')

        sortModelsBy: (value) ->
            if value is 'count'
                @sortByCount()
            else if value is '-count'
                @sortByCountRev()
            else if value is 'alpha'
                @sortByAlpha()
            else if value is '-alpha'
                @sortByAlphaRev()
            return

        sortByCount: ->
            @models = @sortBy('count')
            @trigger 'sort', @

        sortByCountRev: ->
            @models = @sortBy('count').reverse()
            @trigger 'sort', @

        sortByAlpha: ->
            @models = @sortBy('label')
            @trigger 'sort', @

        sortByAlphaRev: ->
            @models = @sortBy('label').reverse()
            @trigger 'sort', @



    class Bar extends c.Marionette.ItemView
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

        serializeData: ->
            attrs = @model.toJSON()
            attrs.label = attrs.values[0]
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


    # Renders a series of bars for each value. This contains the label,
    # count and percentage for the value.
    class BarChart extends c.Marionette.CompositeView
        className: 'info-bar-chart'

        template: templates.chart

        itemView: Bar

        itemViewContainer: '.bars'

        itemViewOptions: (model, index) ->
            model: model
            total: @calcTotal()

        collectionEvents:
            'sort': 'sortChildren'
            'change': 'change'

        events:
            'change [name=sort]': 'sortBy'
            'keyup [name=filter]': 'filterBars'
            'click [name=invert]': 'invertSelection'

        ui:
            sortOrder: '[name=sort]'
            filterInput: '[name=filter]'
            invertButton: '[name=invert]'

        constructor: (options) ->
            options.collection ?= new BarCollection
            @bindContext(options.context)
            super(options)
            @mergeOptions(@options)

        initialize: ->
            # Fetch the field distribution, do not cache
            @model.distribution (resp) =>
                @collection.reset(resp.data, parse: true)
                @setValue(@context.get('value'))

        sortBy: (event) ->
            @collection.sortModelsBy(@ui.sortOrder.val())

        filterBars: (event) ->
            event.stopPropagation()

            text = @ui.filterInput.val()
            regex = new RegExp(text, 'i')

            @children.each (view) ->
                if not text or regex.test(view.model.get('label'))
                    view.$el.show()
                else
                    view.$el.hide()
            return

        invertSelection: (event) ->
            @collection.each (model) ->
                model.set('selected', not model.get('selected'))
            @change()
            return

        sortChildren: (collection, options) ->
            # Iterates over the newly sorted models and re-appends the
            # child views relative to the new indexes
            @collection.each (model) =>
                view = @children.findByModel(model)
                @$(@itemViewContainer).append(view.el)
            return

        calcTotal: ->
            total = 0
            total += count for count in @collection.pluck('count')
            return total

        getField: -> @model.id

        getOperator: -> 'in'

        getValue: ->
            c._.map @collection.where(selected: true), (model) ->
                model.get('label')

        setValue: (values) ->
            if not values?.length then return
            for value in values
                if (model = @collection.findWhere label: value)
                    model.set 'selected', true
            return


    c._.defaults BarChart::, controls.ControlViewMixin


    { BarChart }
