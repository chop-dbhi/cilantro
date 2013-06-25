define [
    '../core'
    './controls/base'
    './controls/date'
    './controls/number'
    './controls/search'
], (c, mods...) ->

    c._.extend {}, mods...
