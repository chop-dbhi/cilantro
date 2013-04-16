define [
    './core'
    './workflows/query'
], (c, mods...) ->
    c._.extend {}, mods...
