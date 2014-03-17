define [
    'underscore'
    './controls/base'
    './controls/range'
    './controls/date'
    './controls/number'
    './controls/search'
    './controls/infograph'
    './controls/registry'
    './controls/null'
], (_, mods...) ->

    _.extend {}, mods...
