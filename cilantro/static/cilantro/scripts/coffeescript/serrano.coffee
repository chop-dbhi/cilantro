define [
    'underscore'
    'serrano/channels'
    'serrano/datafield'
    'serrano/dataconcept'
    'serrano/datacontext'
    'serrano/dataview'
], (_, modules...) ->

    _.extend {}, modules...
