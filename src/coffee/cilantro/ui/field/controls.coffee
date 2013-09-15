define [
    'underscore'
    './controls/base'
    './controls/date'
    './controls/number'
    './controls/search'
], (_, mods...) ->

    _.extend {}, mods...
