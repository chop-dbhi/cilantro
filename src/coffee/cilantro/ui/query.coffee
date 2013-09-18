define [
    'underscore'
    './query/dialog'
    './query/item'
    './query/list'
], (_, mods...) ->

    _.extend {}, mods...
