define [
    'underscore'
    './tables/cell'
    './tables/row'
    './tables/header'
    './tables/footer'
    './tables/body'
    './tables/table'
], (_, mods...) ->

    _.extend {}, mods...
