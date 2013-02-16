define [
    './core'
    './field/item'
    './field/form'
    './field/controls'
    './field/stats'
], (c, mods...) ->

    c._.extend {}, mods...
