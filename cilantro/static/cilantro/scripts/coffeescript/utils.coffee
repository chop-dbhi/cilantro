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

    intword = (value) ->
        if value < 1000
            return intcomma(value)

        for [exp, suffix] in suffixes
            largeNum = Math.pow 10, exp
            if value < largeNum * 1000
                new_value = Math.round(value / largeNum * 10) / 10
                return "#{ new_value } #{ suffix }"

    intcomma = (value, sep=',') ->
        arr = value.toString().split('')
        len = arr.length
        i = len % 3 or 3

        while i < len
            arr.splice i, 0, ','
            i = i+4
        return arr.join('') 


    App.utils = { intword, intcomma }
