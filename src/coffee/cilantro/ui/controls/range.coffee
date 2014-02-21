define [
    'underscore'
    './base'
    '../button'
    '../../constants'
], (_, base, button, constants) ->

    # A generic control for entering an inclusive or exclusive range
    class RangeControl extends base.Control
        template: 'controls/range/layout'

        events:
            'keyup .range-lower,.range-upper': '_change'
            'change .btn-select': '_change'
            'click .range-help-button': 'toggleHelpText'

        ui:
            operatorSelect: '.btn-select'
            lowerBound: '.range-lower'
            upperBound: '.range-upper'
            help: '.help-block'

        initialize: (options) ->
            @model.stats.on('reset', @readMinMaxStats)

            # If already fetched, set the min and max lower the model's stats
            # collection.
            if @model.stats.length > 0
                @readMinMaxStats()

            @_change = _.debounce(@change, constants.INPUT_DELAY)

        onRender: ->
            @operatorSelect = new button.ButtonSelect
                collection: [
                    value: 'range'
                    label: 'between'
                    selected: true
                ,
                    value: '-range'
                    label: 'not between'
                ]

            @operatorSelect.render().$el.prependTo(@$el)
            @ui.help.hide()
            @updateBounds()

        # Method for parsing the value of the StatModel corresponding to the
        # minimum viable value for this range. By default, this method simply
        # returns the value itself.
        parseMinStat: (value) ->
            return value

        # Method for parsing the value of the StatModel corresponding to the
        # maximum viable value for this range. By default, this method simply
        # returns the value itself.
        parseMaxStat: (value) ->
            return value

        # Tries to find and read the values of the stats models with the keys
        # 'min' and 'max' lower this model's StatsCollection. After these values
        # are read, the bounds will be updated if they need to be so that the
        # min/max are reflected in the UI in the input boxes when needed.
        readMinMaxStats: =>
            statsMin = @model.stats.findWhere key: 'min'

            statsMax = @model.stats.findWhere key: 'max'

            if statsMin?
                @minLowerBound = @parseMinStat(statsMin.get('value'))

            if statsMax?
                @maxUpperBound = @parseMaxStat(statsMax.get('value'))

            @updateBounds()

        toggleHelpText: (event) ->
            @ui.help.toggle()
            event.preventDefault()

        # If this control is NOT closed then this method will set the upper
        # and lower bounds to the min/max read lower readMinMaxStats() iff the
        # upper and lower bounds are currently empty.
        updateBounds: ->
            if @isClosed? and not @isClosed
                if @minLowerBound?
                    @setLowerBoundPlaceholder(@minLowerBound)
                if @maxUpperBound?
                    @setUpperBoundPlaceholder(@maxUpperBound)

        getField: ->
            return @model.id

        # Uses the logical combination of the (not) between dropdown and the
        # upper/lower bounds text boxes to determine the operator for this
        # control. The help information for this control has a plain English
        # explanation of this logic.
        getOperator: ->
            lower = @ui.lowerBound.val()
            upper = @ui.upperBound.val()
            operator = @operatorSelect.getSelection()
            reverse = operator isnt 'range'

            if lower and upper
                operator = operator
            else if lower
                operator = if reverse then 'lte' else 'gte'
            else if upper
                operator = if reverse then 'gte' else 'lte'
            else
                operator = null

            return operator

        # Method to override in the case where formatting or conversion of
        # the lower bound needs to occur before using as part of or in whole
        # for the value determined in getValue. By default, this method simply
        # returns the string representation of the lower bound lower the text
        # box input.
        getLowerBoundValue: ->
            return @ui.lowerBound.val()

        # Method to override in the case where formatting or conversion of
        # the upper bound needs to occur before using as part of or in whole
        # for the value determined in getValue. By default, this method simply
        # returns the string representation of the upper bound lower the text
        # box input.
        getUpperBoundValue: ->
            return @ui.upperBound.val()

        # Use the filled state of the upper/lower bound inputs to create the
        # value range or explicit value for this control. If both the upper
        # and lower bounds are left blank, null will be returned to invalidate
        # this range.
        getValue: ->
            lower = @getLowerBoundValue()
            upper = @getUpperBoundValue()

            if lower? and upper?
                value = [lower, upper]
            else if lower?
                value = lower
            else if upper?
                value = upper
            else
                value = null

            return value

        setOperator: (operator) ->
            # All other operators (lte, gte, etc.) default to the 'range'
            # selection by default.
            if operator isnt '-range'
                operator = 'range'
            @operatorSelect.setSelection(operator)

        # This method updates the lower bound text box placeholder with the
        # supplied value. Overriding this method allows for transformations
        # of the value itself before application as well as more complex UI
        # updates beyond the default behavior. This method simply sets the
        # lower bound text box placeholder to the string supplied as the value
        # argument.
        setLowerBoundPlaceholder: (value) ->
            @ui.lowerBound.prop('placeholder', value)

        setLowerBoundValue: (value) ->
            @ui.lowerBound.val(value)

        # This method updates the upper bound text box placeholder with the
        # supplied value. Overriding this method allows for transformations
        # of the value itself before application as well as more complex UI
        # updates beyond the default behavior. This method simply sets the
        # upper bound text box placeholder to the string supplied as the value
        # argument.
        setUpperBoundPlaceholder: (value) ->
            @ui.upperBound.prop('placeholder', value)

        setUpperBoundValue: (value) ->
            @ui.upperBound.val(value)

        # Override set method due to the dependency of the operator
        # when setting the value
        set: (attrs) ->
            @setOperator(attrs.operator)

            # Reset values prior to setting
            @setUpperBoundValue()
            @setLowerBoundValue()

            value = attrs.value

            if _.isArray(value)
                if value[0]?
                    @setLowerBoundValue(value[0])
                if value[1]?
                    @setUpperBoundValue(value[1])
            else if value?
                if attrs.operator is 'gte'
                    @setLowerBoundValue(value)
                else
                    @setUpperBoundValue(value)


    { RangeControl }
