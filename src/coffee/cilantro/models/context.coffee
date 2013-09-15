define [
    'underscore'
    './context/nodes'
    './context/model'
], (_, mods...) ->

    _.extend {}, mods...
