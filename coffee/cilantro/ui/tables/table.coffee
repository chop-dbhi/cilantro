define [
    '../core'
    './body'
    './header'
    './footer'
], (c, body, header, footer) ->


    class Table extends c.Backbone.View
        tagName: 'table'

        className: 'table table-bordered table-striped table-condensed'

        render: ->
            @header = new header.Header c._.extend {}, @options,
                collection: @model.indexes
            
            @body = new body.Body c._.extend {}, @options,
                collection: @model.series

            @footer = new footer.Footer c._.extend {}, @options,
                collection: @model.indexes
                    
            @$el.append(@header.el, @body.el, @footer.el)

            @header.render()
            @body.render()
            @footer.render()

            return @


    { Table }
