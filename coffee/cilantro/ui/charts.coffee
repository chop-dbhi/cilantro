define [
    './core'
    './charts/dist'
    './charts/axis'
    './charts/editable'
], (c, mods...) ->

    c._.extend {}, mods...
