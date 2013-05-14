#   Utilities to formating numbers in a human-readable way.
#
#   * toSuffixedNumber - for numbers greater than or equal to 1000,
#       the output is a suffixed number
#   * toDelimitedNumber - returns a delimited string representation
#       of the number
#   * prettyNumber - attempts to return a number either rounded and/or
#       suffixed, appropriate for the value

define ->

    suffixes = [
        [3, 'K']
        [6, 'million']
        [9, 'billion']
        [12, 'trillion']
        [15, 'quadrillion']
        [18, 'quintillion']
        [21, 'sextillion']
        [24, 'septillion']
        [27, 'octillion']
        [30, 'nonillion']
        [33, 'decillion']
        [100, 'googol']
    ]

    toSuffixedNumber = (value) ->
        if not value? then return
        if value < 1000
            return toDelimitedNumber value

        for [exp, suffix] in suffixes
            largeNum = Math.pow 10, exp
            if value < largeNum * 1000
                new_value = Math.round(value / largeNum * 10) / 10
                return "#{ new_value } #{ suffix }"

     toDelimitedNumber = (value, delim=',') ->
        if not value? then return
        [int, decimal] = value.toString().split('.')
        arr = int.toString().split ''
        len = arr.length
        i = len % 3 or 3

        while i < len
            arr.splice i, 0, delim
            i = i+4
        text = arr.join ''
        if decimal
            text += ".#{decimal}"
        return text

    prettyNumber = (value) ->
        if not value? then return '&infin;'
        if value isnt 0
            # Small float
            if Math.abs(value) < 0.01
                return value.toExponential(2)
            # Other floats
            if Math.round(value) isnt value
                value = value.toPrecision(3)
        return toSuffixedNumber(value)

    { toSuffixedNumber, toDelimitedNumber, prettyNumber }
