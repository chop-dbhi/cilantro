define [
    'underscore'
    './query/dialog'
    './query/item'
    './query/list'
    './query/loader'
], (_, mods...) ->

    _.extend {}, mods...
