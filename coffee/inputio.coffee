((root, factory) ->
    if typeof define is 'function' and define.amd
        # AMD
        define ['jquery'], (jQuery) ->
            root.InputIO = factory(jQuery)
    else
        # Browser globals
        root.InputIO= factory(root.jQuery)
) @, (jQuery) ->

    isArray = $.isArray
    isNumber = (obj) -> $.type(obj) is 'number'
    isNaN = (obj) -> isNumber(obj) and obj isnt +obj
    isBoolean = (obj) -> $.type(obj) is 'boolean'
    isString = (obj) -> $.type(obj) is 'string'
    isDate = (obj) -> $.type(obj) is 'date'

    # Simple test to check if date.js is installed
    dateJSInstalled = Date.CultureInfo?

    getType = ($el) -> $el.attr('data-type') or $el.attr('type')

    get = (selector, type) ->
        multi = false

        # Remove disabled fields from the set
        $el = $(selector).not(':disabled')

        # Set multi if dealing with a checkbox group before
        # filtering out the unchecked boxes
        if $el.is('input[type=checkbox]') and $el.length > 1
            multi = true

        # For check-based inputs, only include the checked values
        if $el.is('input[type=radio],input[type=checkbox]')
            $el = $el.filter(':checked')

        # Multi-selects are handled by jQuery
        if $el.is 'select[multiple]'
            multi = true
            value = coerce($el.val(), type or getType($el))
        # Get values with multiple elements in the set. It is assumed
        # the selector is targeted to a group of elements representing
        # one or more values such as range query.
        else if multi or $el.length > 1
            multi = true

            value = []
            for e in $el
                $e = $(e)
                value.push(coerce($e.val(), type or getType($e)))
        else
            value = coerce($el.val(), type or getType($el))

        # Handle empty values
        if not value? or value is ''
            value = if multi then [] else null
        return value


    set = (selector, value) ->
        multi = false

        $el = $(selector)

        # Checkboxes and radios must all be passed an array otherwise the
        # value attribute will be overwritten. Multi-selects don't actually
        # need an array since an array is checked for internally. This is
        # merely for explicitness.
        if $el.is('select[multiple],input[type=radio],input[type=checkbox]')
            multi = true

        # Inputs that are no inherently 'multi' need to be set per element
        # in the set
        if not multi and $el.length > 1
            if not isArray value
                value = [value]
            for x, i in value
                $($el[i]).val x
            return

        if multi and not isArray value
            value = [value]
        else if not multi and isArray value
            value = value[0]
        $el.val value
        return

    coerceDate = (v) ->
        if not dateJSInstalled
            throw new Error('date.js must be installed to properly dates')
        Date.parse v

    coercers =
        boolean: (v) -> Boolean v
        number: (v) -> parseFloat v
        string: (v) -> v.toString()
        date: coerceDate
        datetime: coerceDate
        time: coerceDate

    # Attempts to coerce some 'raw' value into the specified type
    # otherwise undefined is return.
    coerce = (value, type) ->
        if not value? then return null
        if isArray value
            cleaned = (coerce(x, type) for x in value)
            value = if cleaned.length then cleaned else null
        else if coercers[type]?
            value = coercers[type](value)
        if value is '' or isNaN(value) then null else value

    checkers =
        boolean: isBoolean
        number: isNumber
        string: isString
        date: isDate
        datetime: isDate
        time: isDate

    # Validates the value is of the specified type
    check = (value, type) ->
        if checkers[type]? then checkers[type](value) else true

    { get , set, coerce, coercers, check, checkers }
