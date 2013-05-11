define [
    '../../core'
    './nodes/base'
    './nodes/condition'
    './nodes/branch'
    './nodes/composite'
], (c, mods...) ->

    c._.extend {}, mods...
