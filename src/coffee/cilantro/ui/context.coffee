define [
    'underscore'
    './context/item'
    './context/tree'
], (_, mods...) ->

    _.extend {}, mods...
