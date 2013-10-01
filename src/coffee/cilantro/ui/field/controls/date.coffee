define [
    'underscore'
    '../../controls'
    '../../button'
    'tpl!templates/controls/range-input.html'
], (_, controls, button, templates...) ->

    templates = _.object ['range'], templates

    class DateControl extends controls.Control
        template: templates.range

        events: ->
            'changeDate .datepicker': 'change'
            'keyup .datepicker': 'change'
            'change .btn-select': 'change'
            'click .range-help-button': 'toggleHelpText'

        initialize: (options) ->
            @model = options.model

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
            @ui.lowerBound.datepicker({'autoclose': true})
            @ui.upperBound.datepicker({'autoclose': true})

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
            from_date = @ui.lowerBound.data('datepicker').getFormattedDate()

            to_text = @ui.upperBound.val()
            to_date = @ui.upperBound.data('datepicker').getFormattedDate()

            value = []

            if from_text != "" and to_text != ""
                value = [from_date, to_date]
            else if from_text != ""
                value = from_date
            else if to_text != ""
                value = to_date
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
                        @ui.lowerBound.data('datepicker').setDate(
                            new Date(value[0]))
                    else
                        @ui.lowerBound.val(@minLowerBound ? '')
                    if value[1]?
                        @ui.upperBound.data('datepicker').setDate(
                            new Date(value[1]))
                    else
                        @ui.upperBound.val(@maxUpperBound ? '')
                when 'gte'
                    @ui.lowerBound.data('datepicker').setDate(
                        new Date(value))
                when 'lte'
                    @ui.upperBound.data('datepicker').setDate(
                        new Date(value))

    {DateControl}
