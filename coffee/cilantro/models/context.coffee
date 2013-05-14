define [
    '../core'
    './context/nodes'
    './context/model'
], (c, mods...) ->

    c._.extend {}, mods...
