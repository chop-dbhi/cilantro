define [
    'underscore'
    './concept/info'
    './concept/search'
    './concept/index'
    './concept/panel'
    './concept/form'
    './concept/workspace'
    './concept/columns'
    './concept/dialog'
], (_, mods...) ->

    _.extend {}, mods...
