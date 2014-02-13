define [
    'jquery'
    './utils/numbers'
    './utils/url'
    './utils/version'
], ($, mods...) ->

    # Convenience method for getting a value using the dot-notion for
    # accessing nested structures.
    getDotProp = (obj, key, def) ->
        toks = key.split('.')
        for tok in toks
            if not (obj = obj[tok])?
                return def
        return obj

    # Convenience method for setting a value using the dot-notion for
    # accessing nested structures.
    setDotProp = (obj, key, value) ->
        if typeof key is 'object'
            # Second argument is a boolean to whether or not to replace
            # the options
            if value is true
                return $.extend(true, {}, key)
            return $.extend(true, obj, key)

        toks = key.split('.')
        last = toks.pop()
        for tok in toks
            if not obj[tok]?
                obj[tok] = {}
            obj = obj[tok]
        obj[last] = value
        return

    pprint = (obj) ->
        console.log(JSON.stringify(obj, null, 4))

    $.extend { getDotProp, setDotProp, pprint }, mods...
