define [
    'underscore'
    './models/field'
    './models/concept'
    './models/context'
    './models/view'
    './models/paginator'
    './models/results'
    './models/exporter'
    './models/query'
    './models/value'
], (_, mods...) ->

    _.extend {}, mods...
