define [
    'underscore'
    './field/info'
    './field/form'
    './field/stats'
], (_, mods...) ->

    _.extend {}, mods...
