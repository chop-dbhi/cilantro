define [
    './core'
    './models/field'
    './models/concept'
    './models/context'
    './models/view'
    './models/paginator'
    './models/results'
    './models/exporter'
    './models/value'
], (c, mods...) ->

    c._.extend {}, mods...
