define [
    'underscore'
    './workflows/query'
    './workflows/results'
], (_, mods...) ->

    _.extend {}, mods...
