define [
    'underscore'
    './utils/numbers'
], (_, mods...) ->

    # Convenience method for getting a value using the dot-notion for
    # accessing nested structures.
    getDotProp = (obj, key) ->
        toks = key.split('.')
        for tok in toks
            if not (obj = obj[tok])?
                return
        return obj

    # Convenience method for setting a value using the dot-notion for
    # accessing nested structures.
    setDotProp = (obj, key, value) ->
        toks = key.split('.')
        last = toks.pop()
        for tok in toks
            if not obj[tok]?
                obj[tok] = {}
            obj = obj[tok]
        obj[last] = value
        return

    _.extend {getDotProp, setDotProp}, mods...
