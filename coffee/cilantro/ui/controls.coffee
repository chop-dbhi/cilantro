define [
    './core'
    './controls/core'
    './field/controls'
], (c, mods...) ->
    c._.extend {}, mods...
