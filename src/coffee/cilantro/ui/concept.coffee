define [
    'underscore'
    './concept/info'
    './concept/search'
    './concept/index'
    './concept/panel'
    './concept/form'
    './concept/workspace'
    './concept/columns'
], (_, mods...) ->

    _.extend {}, mods...
