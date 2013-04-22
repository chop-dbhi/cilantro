define [
    '../core'
    './row'
], (c, row) ->


    class Body extends c.Marionette.CollectionView
        tagName: 'tbody'

        template: ->

        itemView: row.Row

        emptyItemView: row.EmptyRow

        itemViewOptions: (model, index) =>
            c._.extend {}, @options,
                collection: model.data


    { Body }
