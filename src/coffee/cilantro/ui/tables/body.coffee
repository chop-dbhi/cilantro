define [
    '../core'
    './row'
], (c, row) ->


    # Represent a "frame" of rows. The model is referenced for keeping
    # track which frame this is relative to the whole series
    class Body extends c.Marionette.CollectionView
        tagName: 'tbody'

        template: ->

        itemView: row.Row

        emptyView: row.EmptyRow

        itemViewOptions: (model, index) =>
            c._.defaults
                collection: model.data
            , @options


    { Body }
