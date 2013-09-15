define [
    'underscore'
    './infograph/bar'
], (_, mods...) ->

    _.extend {}, mods...
