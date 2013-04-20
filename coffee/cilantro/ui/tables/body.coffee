define [
    '../core'
    './row'
], (c, row) ->


    class Body extends c.Marionette.CollectionView
        tagName: 'tbody'

        template: ->

        itemView: row.Row

        emptyItemView: row.EmptyRow

        itemViewOptions: (model, index) ->
            collection: model.data


    { Body }
