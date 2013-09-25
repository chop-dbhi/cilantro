define [
    'underscore'
    'marionette'
    './body'
    './header'
    './footer'
], (_, Marionette, body, header, footer) ->


    # Renders a table with the thead and tfoot elements and one or more
    # tbody elements each representing a frame of data in the collection.
    class Table extends Marionette.CollectionView
        tagName: 'table'

        className: 'table table-striped'

        itemView: body.Body

        itemViewOptions: (item, index) ->
            _.defaults
                collection: item.series
            , @options

        collectionEvents:
            'change:currentpage': 'showCurentPage'

        initialize: ->
            @header = new header.Header _.defaults
                collection: @collection.indexes
            , @options

            @footer = new footer.Footer _.defaults
                collection: @collection.indexes
            , @options

            @header.render()
            @footer.render()

            @$el.append(@header.el, @footer.el)

            @collection.on 'reset', =>
                if @collection.objectCount == 0
                    @$el.hide()
                else
                    @$el.show()

        showCurentPage: (model, num, options) ->
            @children.each (view) ->
                view.$el.toggle(view.model.id is num)


    { Table }
