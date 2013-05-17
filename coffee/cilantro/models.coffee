define [
    './core'
    './models/field'
    './models/concept'
    './models/context'
    './models/view'
    './models/results'
], (c, mods...) ->

    c._.extend {}, mods...
