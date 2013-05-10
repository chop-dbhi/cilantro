define [
    './core'
    './concept/search'
    './concept/info'
    './concept/index'
    './concept/form'
    './concept/workspace'
], (c, mods...) ->

    c._.extend {}, mods...
