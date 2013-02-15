define ['../core', 'serrano'], (c, Serrano) ->
    
    class FieldModel extends Serrano.FieldModel


    class FieldCollection extends Serrano.FieldCollection
        url: ->
            c.getSessionUrl('fields')

        initialize: ->
            super
            c.subscribe c.SESSION_OPENED, => @fetch()
            c.subscribe c.SESSION_CLOSED, => @reset()


    { FieldCollection, FieldModel }
