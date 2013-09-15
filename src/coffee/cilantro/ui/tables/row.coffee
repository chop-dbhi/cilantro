define [
    'underscore'
    'marionette'
    '../base'
    './cell'
], (_, Marionette, base, cell) ->


    class Row extends Marionette.CollectionView
        tagName: 'tr'

        template: ->

        itemView: cell.Cell

        itemViewOptions: (model, index) =>
            _.extend {}, @options,
                model: model


    class EmptyRow extends base.LoadView
        align: 'left'

        tagName: 'tr'


    { Row, EmptyRow }
