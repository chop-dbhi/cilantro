define [
    '../core'
], (c) ->

    # Control interface, this should not be used directly
    class Control extends c.Marionette.Layout

        getId: ->
        getOperator: ->
        getValue: ->
        getNulls: ->

        setId: (value) ->
        setOperator: (value) ->
        setValue: (value) ->
        setNulls: (value) ->

        get: ->
            id: @getId()
            operator: @getOperator()
            value: @getValue()
            null: @getNulls()

        set: (attrs={}) ->
            @setId attrs.id
            @setValue attrs.value
            @setOperator attrs.operator
            @setNulls attrs.null


    { Control }
