define [
    '../core'
    './controls/base'
    './controls/number'
    './controls/search'
], (c, mods...) ->

    c._.extend {}, mods...
