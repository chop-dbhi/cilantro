define [
    'underscore'
    '../../controls'
    '../../button'
    'tpl!templates/controls/number-range-input.html'
], (_, controls, button, templates...) ->

    templates = _.object ['number'], templates

    class NumberControl extends controls.Control
        template: templates.number

        events: ->
            'keyup .range-from, .range-to': 'change'
            'change .btn-select': 'change'
            'click .range-help-button': 'toggleHelpText'

        initialize: (options) ->
            @model = options.model

            @model.stats.on 'reset', =>
                @statsMin = _.find(@model.stats.models, (stat) ->
                    return stat.get('label') == 'Min'
                )?.get('value')

                if @statsMin? and not @ui.lowerBound.val()
                    @ui.lowerBound.val(@statsMin)

                @statsMax = _.find(@model.stats.models, (stat) ->
                    return stat.get('label') == 'Max'
                )?.get('value')

                if @statsMax and not @ui.upperBound.val()
                    @ui.upperBound.val(@statsMax)

        ui:
            inOutSelect: '.btn-select'
            lowerBound: '.range-from'
            upperBound: '.range-to'

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
            @$('.help-block').hide()

            @set(@context)

        toggleHelpText: (event) ->
            @$('.help-block').toggle()
            event.preventDefault()

        isBetweenSelected: ->
            return @inOutSelect.getSelection() == 'between'

        getField: ->
            return @model.id

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
            # If both fields are emtpy, return null to invalidate this range
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
                    else
                        @ui.lowerBound.val('')
                    if value[1]?
                        @ui.upperBound.val(value[1])
                    else
                        @ui.upperBound.val('')
                when 'gte'
                    @ui.lowerBound.val(value)
                when 'lte'
                    @ui.upperBound.val(value)

    { NumberControl }
