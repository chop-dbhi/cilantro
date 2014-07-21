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
            'change:currentpage': 'showCurrentPage'

        initialize: ->
            @listenTo(this, 'render', @resize, @)
            _.bindAll(this, 'resize')
            $(window).resize(this.resize)

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

        resize: ->
            tbody = $('tbody')
            if tbody.height() > 0
                for field, i in @$el.children()
                    rows = field.rows
                    for row in rows
                        colls = row.cells
                        width = $(document).width()/colls.length
                        for coll in colls
                            $(coll).css('width', width)
                            $(coll).css('max-width', width)

                offset = tbody.height() +
                parseInt(tbody.css('top').replace('px',''))

                #Statically position bootstrap-responsive elements
                if $(document).width() > 979
                    $('#footer').offset({top:offset})
                    tbody.css('position','absolute')
                else
                    $('#footer').css('position','static')
                    tbody.css('position','static')

        showCurrentPage: (model, num, options) ->
            @children.each (view) ->
                view.$el.toggle(view.model.id is num)


    { Table }
