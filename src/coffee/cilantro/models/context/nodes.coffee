define [
    'underscore'
    './nodes/base'
    './nodes/condition'
    './nodes/branch'
    './nodes/composite'
], (_, mods...) ->

    _.extend {}, mods...
