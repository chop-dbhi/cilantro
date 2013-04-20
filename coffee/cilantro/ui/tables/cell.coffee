define [
    '../core'
], (c) ->


    class Cell extends c.Backbone.View
        tagName: 'td'

        render: ->
            @$el.html(@model.get('value'))
            return @


    { Cell }
