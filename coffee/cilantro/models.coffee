define [
    './core'
    './models/field'
    './models/concept'
    './models/context'
    './models/view'
    './models/results'
    './models/exporter'
], (c, mods...) ->

    c._.extend {}, mods...
