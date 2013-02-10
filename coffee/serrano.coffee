define [
    'underscore'
    './serrano/channels'
    './serrano/field'
    './serrano/concept'
    './serrano/context'
    './serrano/view'
], (_, channels, mods...) ->

    _.extend {}, { channels }, mods...
