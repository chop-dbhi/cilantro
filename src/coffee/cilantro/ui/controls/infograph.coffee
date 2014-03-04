define [
    'underscore'
    'backbone'
    'marionette'
    './base'
    '../button'
], (_, Backbone, Marionette, base, button) ->

    # Returns a function closure that can be used to sort by attribute values
    # for a collection of models.
    sortModelAttr = (attr) ->
        (model) ->
            value = model.get(attr)
            if _.isString(value)
                value = value.toLowerCase()
            return value

    # Model with minimal parsing for unpacking the source value contained
    # with an array.
    class BarModel extends Backbone.Model
        parse: (attrs) ->
            attrs.value = attrs.values[0]
            return attrs

    # Collection of models representing the distribution data. Includes
    # a method for sorting models by an attribute. If the attribute is
    # prefixed with a hyphen '-', the sort will be reversed (descending).
    # This triggers the 'sort' event unless the 'silent' option is true.
    class BarCollection extends Backbone.Collection
        model: BarModel

        comparator: (model) ->
            -model.get('count')

        sortModelsBy: (attr) ->
            if (reverse = attr.charAt(0) is '-')
                attr = attr.slice(1)

            @models = @sortBy(sortModelAttr(attr))

            if reverse then @models.reverse()
            @trigger('sort', @)
            return

    # View rendering the data in BarModel including stats relative to the
    # 'total' option such as the percentile of it's 'count'. Bars have
    # 'selected' and 'visibility' properties, both of which can be toggled.
    class Bar extends Marionette.ItemView
        className: 'info-bar'

        template: 'controls/infograph/bar'

        options:
            total: null

        ui:
            bar: '.bar'

        events:
            'click': 'toggleSelected'

        modelEvents:
            'change:selected': 'setSelected'
            'change:visible': 'setVisible'
            'change:excluded': 'setExcluded'

        serializeData: ->
            attrs = @model.toJSON()
            attrs.value = attrs.values[0]
            percentage = @getPercentage()
            attrs.width = percentage
            # Simplify percentages that are less than one to be represented
            # as such rather than a small floating point.
            if percentage < 1
                attrs.percentage = '<1'
            else
                attrs.percentage = parseInt(percentage)
            return attrs

        onRender: ->
            @setSelected(@model, !!@model.get('selected'))

        # Returns the percentage of the value's count relative to the 'total'
        getPercentage: ->
            @model.get('count') / @options.total * 100

        # Toggle the selected state of the bar
        toggleSelected: (event) ->
            @model.set('selected', not @model.get('selected'))

        setExcluded: (model, value) ->
            @$el.toggleClass('excluded', value)

        # Sets the selected state of the bar. If the bar is filtered,
        # deselecting it will hide the bar from view.
        setSelected: (model, value) ->
            @$el.toggleClass('selected', value)
            if not value and model.get('visible') is false
                @$el.removeClass('filtered').hide()

        # Sets the visibility of the bar based on it's current state.
        setVisible: (model, value) ->
            if value
                @$el.removeClass('filtered').show()
            else if model.get('selected')
                @$el.addClass('filtered')
            else
                @$el.hide()


    # Renders a series of bars for each value. This contains the value,
    # count and percentage for the value.
    class Bars extends base.ControlCollectionView
        className: 'info-bar-chart'

        itemView: Bar

        itemViewOptions: (model, index) ->
            model: model
            total: @calcTotal()

        collectionEvents:
            'change': 'change'
            'sort': 'sortChildren'

        initialize: ->
            @wait()

            # Fetch the field distribution, do not cache
            # TODO make this more transparent by setting
            @model.distribution (resp) =>
                @collection.reset(resp.data, parse: true)
                @ready()

        # Sums the total count across all values
        calcTotal: ->
            total = 0
            total += count for count in @collection.pluck('count')
            return total

        # Sorts the children based the on the current order of the collection
        sortChildren: (collection, options) ->
            # Iterates over the newly sorted models and re-appends the
            # child views relative to the new indexes
            @collection.each (model) =>
                view = @children.findByModel(model)
                @$el.append(view.el)
            return

        getField: -> @model.id

        getOperator: ->
            # Since all selected bars are either included or excluded, the
            # precense of a single excluded bar in those selected means that
            # we should be using the exclusive operator. Otherwise, return
            # the inclusive operator.
            if @collection.where(excluded: true).length > 0
                return '-in'
            else
                return 'in'

        getValue: ->
            _.map @collection.where(selected: true), (model) ->
                model.get('value')

        setValue: (values=[]) ->
            # Toggle the selection based on the presence values
            @collection.each (model) ->
                model.set('selected', model.get('value') in values)
            return

        setOperator: (operator) ->
            if operator is '-in'
                @collection.each (model) ->
                    model.set('excluded', true)
                $('input[name=exclude]').attr('checked', true)
            return


    # The toolbar makes it easier to interact with large lists of values. It
    # supports filtering values by text. Also, a button is provided to invert
    # the selection of values. When combined with filtering, values are selected
    # if they are not filtered by the search. The values themselves are sortable
    # by the label or the count.
    class BarChartToolbar extends Marionette.ItemView
        className: 'navbar navbar-toolbar'

        template: 'controls/infograph/toolbar'

        events:
            # Note, that no delay is used since it is working with a local list
            # of values so the filtering can keep it.
            'keyup [name=filter]': 'filterBars'
            'click [name=invert]': 'invertSelection'
            'click .sort-value-header, .sort-count-header': 'sortBy'
            'change [name=exclude]': 'excludeCheckboxChanged'

        ui:
            toolbar: '.btn-toolbar'
            filterInput: '[name=filter]'
            invertButton: '[name=invert]'
            sortValueHeader: '.sort-value-header'
            sortCountHeader: '.sort-count-header'
            excludeCheckbox: '[name=exclude]'

        initialize: ->
            @sortDirection = '-count'

        sortBy: (event) ->
            if event.currentTarget.className is 'sort-value-header'
                if @sortDirection == '-value'
                    @sortDirection = 'value'
                else
                    @sortDirection = '-value'
            else
                if @sortDirection == '-count'
                    @sortDirection = 'count'
                else
                    @sortDirection = '-count'

            switch @sortDirection
                when '-count'
                    @ui.sortValueHeader.html('Value <i class=icon-sort></i>')
                    @ui.sortCountHeader.html('Count <i class=icon-sort-down></i>')
                when 'count'
                    @ui.sortValueHeader.html('Value <i class=icon-sort></i>')
                    @ui.sortCountHeader.html('Count <i class=icon-sort-up></i>')
                when '-value'
                    @ui.sortValueHeader.html('Value <i class=icon-sort-down></i>')
                    @ui.sortCountHeader.html('Count <i class=icon-sort></i>')
                when 'value'
                    @ui.sortValueHeader.html('Value <i class=icon-sort-up></i>')
                    @ui.sortCountHeader.html('Count <i class=icon-sort></i>')

            @collection.sortModelsBy(@sortDirection)

        toggle: (show) =>
            @ui.filterInput.toggle(show)
            @ui.invertButton.toggle(show)
            @ui.sortValueHeader.toggle(show)
            @ui.sortCountHeader.toggle(show)

        # Filters the bars given a text string or via an event from the input
        filterBars: (event) ->
            if _.isString(event)
                text = event
            else
                event?.stopPropagation()
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

        excludeCheckboxChanged: ->
            @collection.each (model) =>
                model.set('excluded', @ui.excludeCheckbox.prop('checked'))
            @collection.trigger('change')
            return


    # Infograph-style control which renders a list of horizontal bars filled
    # based on their percentage of the total population. Bars can be clicked
    # to be selected for inclusion. For small sets of values, the
    # 'minValuesForToolbar' option can be set (to an integer) to hide the
    # toolbar.
    class InfographControl extends base.ControlLayout
        template: 'controls/infograph/layout'

        events:
            change: 'change'

        options:
            minValuesForToolbar: 10

        regions:
            bars: '.bars-region'
            toolbar: '.toolbar-region'

        ui:
            loading: '[data-target=loading-indicator]'

        collectionEvents:
            'reset': 'toggleToolbar'

        # Internally defined collection for wrapping the available values as
        # well as maintaining state for which values are selected.
        constructor: (options) ->
            options.collection ?= new BarCollection
            super(options)

            @barsControl = new Bars
                model: @model
                collection: @collection

            # Proxy all control-based operations to the bars
            for method in ['set', 'get', 'when', 'ready', 'wait']
                do (method) =>
                    @[method] = (args...) =>
                        @barsControl[method](args...)

            # Proxy events
            @listenTo @barsControl, 'all', (event, args...) ->
                if event in ['change', 'beforeready', 'ready']
                    @trigger(event, args...)

                if event == 'ready'
                    @ui.loading.hide()

        toggleToolbar: =>
            # Not yet rendered, this will be called again in onRender
            if not @toolbar.currentView then return
            @toolbar.currentView.toggle(@collection.length >= @options.minValuesForToolbar)

        onRender: ->
            @bars.show(@barsControl)

            @toolbar.show new BarChartToolbar
                collection: @collection

            @toggleToolbar()


    { InfographControl }
