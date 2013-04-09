define [
    './core'
    './controls/base'
    './controls/input'
], (c, mods...) ->

    c._.extend {}, mods...
