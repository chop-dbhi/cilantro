define [
    'underscore'
    './controls/base'
    './controls/input'
], (_, mods...) ->

    _.extend {}, mods...
