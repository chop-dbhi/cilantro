define [
    'underscore'
    './controls/range'
    './controls/date'
    './controls/number'
    './controls/search'
], (_, mods...) ->

    _.extend {}, mods...
