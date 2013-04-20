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
            @header = new header.Header
                model: @model.indexes
            
            @body = new body.Body
                collection: @model.series

            @footer = new footer.Footer
                model: @model.indexes
                    
            @$el.append(@header.el, @body.el, @footer.el)

            @header.render()
            @body.render()
            @footer.render()

            return @


    { Table }
