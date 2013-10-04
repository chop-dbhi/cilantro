define [
    './range'
], (range) ->

    # A control for entering an inclusive or exclusive numeric range
    class NumberControl extends range.RangeControl
        # Cast the lower bound to a number for use in the getValue() method
        getLowerBoundValue: ->
            return parseFloat(@ui.lowerBound.val())

        # Case the upper bound to a number for use in the getValue() method
        getUpperBoundValue: ->
            return parseFloat(@ui.upperBound.val())

    { NumberControl }
