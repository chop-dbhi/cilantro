define [
    './core'
    './concept/search'
    './concept/item'
    './concept/index'
], (c, mods...) ->

    class ConceptWorkspace extends c.Marionette.CollectionView
        className: 'concept-workspace'


    class ConceptForm extends c.Marionette.ItemView
        className: 'concept-form'


    c._.extend { ConceptWorkspace, ConceptForm }, mods...
