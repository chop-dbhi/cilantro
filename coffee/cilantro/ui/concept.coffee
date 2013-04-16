define [
    './core'
    './concept/search'
    './concept/item'
    './concept/index'
    './concept/form'
    './concept/workspace'
], (c, mods...) ->

    c._.extend {}, mods...
