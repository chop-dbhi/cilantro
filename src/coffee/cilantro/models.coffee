define [
    'underscore'
    './models/base'
    './models/field'
    './models/concept'
    './models/context'
    './models/view'
    './models/paginator'
    './models/results'
    './models/exporter'
    './models/query'
    './models/value'
    './models/set'
], (_, mods...) ->

    _.extend {}, mods...
