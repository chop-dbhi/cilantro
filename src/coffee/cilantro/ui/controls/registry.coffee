define [
    'underscore'
    '../../core'
    './date'
    './number'
    './search'
    './select'
    './infograph'
], (_, c, date, number, search, select, infograph) ->

    defaultControls =
        infograph: infograph.InfographControl
        number: number.NumberControl
        date: date.DateControl
        search: search.SearchControl
        singleSelectionList: select.SingleSelectionList
        multiSelectionList: select.MultiSelectionList

    customControls = {}

    # Controls can be registered as AMD modules which will be immediately
    # fetched to obtain the resulting compiled control function. This is
    # count of the number of pending AMD modules that have not been fetched.
    pendingRemotes = 0

    # Loads the remote control and adds it to the custom cache.
    loadRemote = (id, module) ->
        pendingRemotes++

        require [module], (func) ->
            controlCacheCustom[id] = func
            pendingRemotes--
        , (err) ->
            pendingRemotes--

    # Handles the case when the registered function is *not* a function.
    _set = (id, func) ->
        switch (typeof func)
            when 'function'
                customControls[id] = func
            when 'string'
                loadRemote(id, func)
            else
                throw new Error('control must be a function or AMD module')

    # Get the control function by id. Checks the custom cache and falls back
    # to the built-in cache.
    get = (id) ->
        customControls[id] or defaultControls[id]

    # Sets a control in cache.
    set = (id, func) ->
        if typeof id is 'object'
            _set(key, func) for key, func of id
        else
            _set(id, func)
        return

    # Returns a boolean denoting if all AMD-based controls have been loaded.
    ready = ->
        pendingRemotes is 0


    { get, set, ready }
