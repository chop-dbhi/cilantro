define [
    './core'
    './tables/cell'
    './tables/row'
    './tables/header'
    './tables/footer'
    './tables/body'
    './tables/table'
], (c, mods...) ->

    c._.extend {}, mods...
