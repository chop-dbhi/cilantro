define [
    'underscore'
    '../../core'
    './date'
    './number'
    './search'
    './select'
    './infograph'
], (_, c, date, number, search, select, infograph) ->


    builtinControls =
        infograph: infograph.InfographControl
        number: number.NumberControl
        date: date.DateControl
        search: search.SearchControl
        singleSelectionList: select.SingleSelectionList
        multiSelectionList: select.MultiSelectionList

    controls = _.extend({}, builtinControls, c.config.get('controls'))


    get = (id) ->
        controls[id]

    set = (id, control) ->
        controls[id] = control
        return


    { get, set }
