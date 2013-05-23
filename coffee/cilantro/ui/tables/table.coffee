define [
    '../core'
    './body'
    './header'
    './footer'
], (c, body, header, footer) ->


    # Renders a table with the thead and tfoot elements and one or more
    # tbody elements each representing a frame of data in the collection.
    class Table extends c.Marionette.CollectionView
        tagName: 'table'

        className: 'table table-bordered table-striped table-condensed'

        itemView: body.Body

        itemViewOptions: (item, index) ->
            c._.defaults
                collection: item.series
            , @options

        collectionEvents:
            'change:currentpage': 'showCurentPage'

        initialize: ->
            @header = new header.Header c._.defaults
                collection: @collection.indexes
            , @options

            @footer = new footer.Footer c._.defaults
                collection: @collection.indexes
            , @options

            @header.render()
            @footer.render()

            @$el.append(@header.el, @footer.el)

        showCurentPage: (model, num, options) ->
            @children.each (view) ->
                view.$el.toggle(view.model.id is num)


    { Table }
