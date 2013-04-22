define [
    '../core'
    './row'
], (c, row) ->

    class HeaderCell extends c.Backbone.View
        tagName: 'th'

        initialize: ->
            @listenTo @model, 'change:visible', @toggleVisible

        render: ->
            @toggleVisible()
            @$el.html(@model.get('name'))
            return @

        toggleVisible: ->
            @$el.toggle(@model.get 'visible')


    class HeaderRow extends row.Row
        itemView: HeaderCell


    class Header extends c.Backbone.View
        tagName: 'thead'

        render: ->
            row = new HeaderRow
                collection: @collection
            @$el.html(row.el)
            row.render()
            return @


    { Header }
