define [
    './core'
    './concept/info'
    './concept/search'
    './concept/index'
    './concept/panel'
    './concept/form'
    './concept/workspace'
    './concept/columns'
], (c, mods...) ->

    c._.extend {}, mods...
