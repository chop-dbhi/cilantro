define [
    'underscore'
    './field/info'
    './field/form'
    './field/controls'
    './field/stats'
], (_, mods...) ->

    _.extend {}, mods...
