define [
    'underscore'
    'marionette'
    './row'
], (_, Marionette, row) ->

    # Represent a "frame" of rows. The model is referenced for keeping
    # track which frame this is relative to the whole series
    class Body extends Marionette.CollectionView
        tagName: 'tbody'

        template: ->

        itemView: row.Row

        itemViewOptions: (model, index) =>
            _.defaults
                collection: model.data
            , @options


    { Body }
