define [
    '../../core'
    '../../controls'
    './base'
], (c, controls, base) ->


    class NumberControl extends base.FieldControl
        options:
            regionViews:
                value: controls.RangeInput

        events: ->
            events = c._.clone base.FieldControl::events
            events["change #{@dataSelectors.operator}"] = 'toggleRange'
            return events

        toggleRange: ->
            input2 = @value.currentView.input2.ui.input
            if /range/i.test(@getOperator())
                input2.prop('disabled', false).show()
            else
                input2.prop('disabled', true).hide()

        onRender: ->
            super
            @toggleRange()


    { NumberControl }
