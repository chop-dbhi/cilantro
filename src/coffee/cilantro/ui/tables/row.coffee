define [
    '../core'
    '../base'
    './cell'
], (c, base, cell) ->


    class Row extends c.Marionette.CollectionView
        tagName: 'tr'

        template: ->

        itemView: cell.Cell

        itemViewOptions: (model, index) =>
            c._.extend {}, @options,
                model: model


    class EmptyRow extends base.LoadView
        align: 'left'

        tagName: 'tr'


    { Row, EmptyRow }
