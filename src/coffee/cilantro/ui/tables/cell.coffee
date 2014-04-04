define [
    'marionette'
], (Marionette) ->


    class Cell extends Marionette.View
        tagName: 'td'

        initialize: ->
            @listenTo(@model.index, 'change:visible', @toggleVisible, @)

        render: ->
            @toggleVisible()
            @$el.html(@model.get('value'))
            return @

        toggleVisible: ->
            @$el.toggle(@model.index.get 'visible')


    { Cell }
