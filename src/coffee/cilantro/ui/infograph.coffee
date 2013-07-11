define [
    './core'
    './infograph/bar'
], (c, mods...) ->

    c._.extend {}, mods...
