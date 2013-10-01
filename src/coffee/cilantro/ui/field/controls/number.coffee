define [
    'underscore'
    '../../controls'
    '../../button'
    'tpl!templates/controls/range-input.html'
], (_, controls, button, templates...) ->

    templates = _.object ['range'], templates

    # A control for entering an inclusive or exclusive numeric range
    class NumberControl extends controls.Control
        template: templates.range

        events: ->
            'keyup .range-from, .range-to': 'change'
            'change .btn-select': 'change'
            'click .range-help-button': 'toggleHelpText'

        ui:
            inOutSelect: '.btn-select'
            lowerBound: '.range-from'
            upperBound: '.range-to'
            help: '.help-block'

        initialize: (options) ->
            @model = options.model

            # Try to read the min and max directly from the model's stats
            # collection but in the event that the stats have not already
            # been retrieved, attach a listener to the reset event so we can
            # read the stats when the are fetched.
            if @model.stats.length > 0
                @readMinMaxStats()
            else
                @model.stats.on 'reset', =>
                    @readMinMaxStats()

        onRender: ->
            @inOutSelect = new button.ButtonSelect
                collection: [
                    value: 'between'
                    label: 'between'
                    selected: true
                ,
                    value: 'not_between'
                    label: 'not between'
                ]

            @inOutSelect.render().$el.prependTo(@$el)
            @ui.help.hide()
            @updateBounds()

            @set(@context)

        # Tries to find and read the values of the stats models with the keys
        # 'min' and 'max' from this model's StatsCollection. After these values
        # are read, the bounds will be updated if they need to be so that the
        # min/max are reflected in the UI in the input boxes when needed.
        readMinMaxStats: =>
            statsMin = _.find(@model.stats.models, (stat) ->
                return stat.get('label') == 'Min'
            )?.get('value')

            if statsMin?
                @minLowerBound = statsMin

            statsMax = _.find(@model.stats.models, (stat) ->
                return stat.get('label') == 'Max'
            )?.get('value')

            if statsMax?
                @maxUpperBound = statsMax

            @updateBounds()

        toggleHelpText: (event) ->
            @ui.help.toggle()
            event.preventDefault()

        isBetweenSelected: ->
            return @inOutSelect.getSelection() == 'between'

        # If this control is NOT closed then this method will set the upper
        # and lower bounds to the min/max read from readMinMaxStats() iff the
        # upper and lower bounds are currently empty.
        updateBounds: ->
            if @isClosed? and not @isClosed
                if @ui.lowerBound.val() == ""
                    @ui.lowerBound.val(@minLowerBound)
                if @ui.upperBound.val() == ""
                    @ui.upperBound.val(@maxUpperBound)

        getField: ->
            return @model.id

        # Uses the logical combination of the (not) between dropdown and the
        # upper/lower bounds text boxes to determine the operator for this
        # control. The help information for this control has a plain English
        # explanation of this logic.
        getOperator: ->
            from = @ui.lowerBound.val()
            to = @ui.upperBound.val()
            operator = ''

            if from != "" and to != ""
                operator = if @isBetweenSelected() then 'range' else '-range'
            else if from != ""
                operator = if @isBetweenSelected() then 'gte' else 'lte'
            else if to != ""
                operator = if @isBetweenSelected() then 'lte' else 'gte'
            else
                operator = if @isBetweenSelected() then 'range' else '-range'

            return operator

        # Use the filled state of the upper/lower bound inputs to create the
        # value range or explicit value for this control. If both the upper
        # and lower bounds are left blank, null will be returned to invalidate
        # this range.
        getValue: ->
            from_text = @ui.lowerBound.val()
            from_num = Number(from_text)

            to_text = @ui.upperBound.val()
            to_num = Number(to_text)

            value = []

            if from_text != "" and to_text != ""
                value = [from_num, to_num]
            else if from_text != ""
                value = from_num
            else if to_text != ""
                value = to_num
            else
                value = null

            return value

        setOperator: (operator) ->
            @operator = operator

            if operator == '-range'
                @inOutSelect.setSelection("not_between")
            else
                @inOutSelect.setSelection("between")

        setValue: (value) ->
            switch @operator
                when 'range', '-range'
                    if value[0]?
                        @ui.lowerBound.val(value[0])
                    if value[1]?
                        @ui.upperBound.val(value[1])
                when 'gte'
                    if value?
                        @ui.lowerBound.val(value)
                when 'lte'
                    if value?
                        @ui.upperBound.val(value)


    { NumberControl }
