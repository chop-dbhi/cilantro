define [
    '../../core'
    '../../controls'
    'tpl!templates/controls/date-range-input.html'
], (c, controls, templates...) ->
    
    templates = c._.object ['date'], templates

    class DateControl extends controls.Control 
        template: templates.date

        events: ->
            'changeDate .datepicker': 'change'
            'keyup .datepicker': 'change'

        initialize: (options) ->
            @model = options.model
            
        onRender: ->
            @$('.range-from').datepicker({'autoclose': true})
            @$('.range-to').datepicker({'autoclose': true})

        getField: ->
            return @model.id

        getOperator: ->
            from = @$('.range-from').val()
            to = @$('.range-to').val()
            operator = ''

            if from != "" and to != ""
                operator = 'range'
            else if from != ""
                operator = 'gte'
            else if to != ""
                operator = 'lte'
            else
                operator = 'range'
           
            return operator

        getValue: ->
            from_text = @$('.range-from').val()
            from_date = @$('.range-from').data('datepicker').getFormattedDate()

            to_text = @$('.range-to').val()
            to_date = @$('.range-to').data('datepicker').getFormattedDate()
            
            value = []
            
            if from_text != "" and to_text != ""
                value = [from_date, to_date]
            else if from_text != ""
                value = from_date
            else if to_text != ""
                value = to_date
            else
                value = [null, null]
             
            return value

        setOperator: (operator) ->
            @operator = operator

        setValue: (value) ->
            switch @operator
                when 'range'
                    if value[0]?
                        @$('.range-from').data('datepicker').setDate(
                            new Date(value[0]))
                    else
                        @$('.range-from').val('')
                    if value[1]?
                        @$('.range-to').data('datepicker').setDate(
                            new Date(value[1]))
                    else
                        @$('.range-to').val('')
                when 'gte'
                    @$('.range-from').data('datepicker').setDate(
                        new Date(value))
                when 'lte'
                    @$('.range-to').data('datepicker').setDate(
                        new Date(value))

    {DateControl}
