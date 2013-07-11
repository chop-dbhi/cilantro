define [
    './core'
    './field/info'
    './field/form'
    './field/controls'
    './field/stats'
], (c, mods...) ->

    c._.extend {}, mods...
