define [
    './core'
    './workflows/query'
    './workflows/results'
], (c, mods...) ->

    c._.extend {}, mods...
