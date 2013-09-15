define [
    'underscore'
    './charts/dist'
    './charts/axis'
    './charts/editable'
], (_, mods...) ->

    _.extend {}, mods...
