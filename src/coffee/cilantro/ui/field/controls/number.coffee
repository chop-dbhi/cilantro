define [
    './range'
], (range) ->

    # A control for entering an inclusive or exclusive numeric range
    class NumberControl extends range.RangeControl
        # Cast the lower bound to a number for use in the getValue() method
        getLowerBoundValue: ->
            if (value = @ui.lowerBound.val().trim())
                return parseFloat(value)

        # Case the upper bound to a number for use in the getValue() method
        getUpperBoundValue: ->
            if (value = @ui.upperBound.val().trim())
                return parseFloat(value)

    { NumberControl }
