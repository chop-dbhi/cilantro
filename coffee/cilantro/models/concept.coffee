define ['../core', 'serrano', './field'], (c, Serrano, fields) ->
    
    class ConceptModel extends Serrano.ConceptModel
        fieldModel: fields.FieldModel


    class ConceptCollection extends Serrano.ConceptCollection
        model: ConceptModel

        url: ->
            c.getSessionUrl('concepts')

        initialize: ->
            super
            c.subscribe c.SESSION_OPENED, => @fetch()
            c.subscribe c.SESSION_CLOSED, => @reset()


    { ConceptCollection, ConceptModel }
