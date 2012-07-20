# utils/numbers
#
#   Utilities to formating numbers in a human-readable way.
#
#   * toSuffixedNumber - for numbers greater than or equal to 1000,
#       the output is a suffixed number
#   * toDelimitedNumber - returns a delimited string representation
#       of the number

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
        arr = value.toString().split ''
        len = arr.length
        i = len % 3 or 3

        while i < len
            arr.splice i, 0, delim
            i = i+4
        return arr.join ''


    { toSuffixedNumber, toDelimitedNumber }
