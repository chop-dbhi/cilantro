define [
    'underscore'
    '../../core'
    './date'
    './number'
    './search'
    './infograph'
], (_, c, date, number, search, infograph) ->


    builtinControls =
        infograph: infograph.InfographControl
        number: number.NumberControl
        date: date.DateControl
        search: search.SearchControl

    controls = _.extend({}, builtinControls, c.config.get('controls'))


    get = (id) ->
        controls[id]

    set = (id, control) ->
        controls[id] = control
        return


    { get, set }
