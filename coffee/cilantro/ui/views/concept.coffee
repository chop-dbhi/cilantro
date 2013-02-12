define [
    '../core'
    './concept/search'
    './concept/item'
    './concept/index'
    './concept/form'
], (c, mods...) ->

    class ConceptWorkspace extends c.Marionette.CollectionView
        className: 'concept-workspace'

    c._.extend { ConceptWorkspace }, mods...
