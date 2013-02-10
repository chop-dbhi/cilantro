define ['../core', 'serrano'], (c, Serrano) ->
    
    class ConceptModel extends Serrano.ConceptModel

    class ConceptCollection extends Serrano.ConceptCollection
        model: ConceptModel

        url: ->
            c.getSessionUrl('concepts')

        initialize: ->
            c.subscribe c.SESSION_OPENED, => @fetch()
            c.subscribe c.SESSION_CLOSED, => @reset()


    { ConceptCollection, ConceptModel }
