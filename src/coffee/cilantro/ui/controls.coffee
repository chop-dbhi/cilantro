define [
    'underscore'
    './controls/base'
    './controls/range'
    './controls/date'
    './controls/number'
    './controls/search'
    './controls/infograph'
], (_, mods...) ->

    _.extend {}, mods...
