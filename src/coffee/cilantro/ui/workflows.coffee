define [
    'underscore'
    './workflows/query'
    './workflows/results'
    './workflows/workspace'
], (_, mods...) ->

    _.extend {}, mods...
