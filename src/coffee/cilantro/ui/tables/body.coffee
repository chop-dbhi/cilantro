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

        initialize: ->
            offset = 0
            for field, i in $('.navbar-fixed-top')
                offset += field.clientHeight

            @$el.css('top', offset)
            @$el.css('position', 'absolute')

        itemViewOptions: (model, index) =>
            _.defaults
                collection: model.data
            , @options


    { Body }
