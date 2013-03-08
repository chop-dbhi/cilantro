define [
    './core'
    './charts/dist'
], (c, mods...) ->

    c._.extend {}, mods...
