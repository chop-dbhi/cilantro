define [
    '../core'
    './row'
    'underscore'
], (c, row, _) ->

    class HeaderCell extends c.Backbone.View
        tagName: 'th'

        constructor: (options) ->
            if not options.view?
                throw new Error 'ViewModel instance required'
            @view = options.view
            delete options.view
            super(options)

        onClick: ->
            _.each(@view.facets.models, (f) ->     
                if f.get('concept') == @model.id
                    direction = f.get('sort')
                    
                    if direction?
                        if direction.toLowerCase() == "asc"
                            f.set('sort', "desc")
                            f.set('sort_index', 0)
                        else
                            f.unset('sort')
                            f.unset('sort_index')
                    else
                        f.set('sort', "asc")
                        f.set('sort_index', 0)
                else
                    f.unset('sort')
                    f.unset('sort_index')
            , this)

            @view.save()

        initialize: ->
            @listenTo @model, 'change:visible', @toggleVisible

        events:
            "click": "onClick"

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
            row = new HeaderRow c._.extend {}, @options,
                collection: @collection
            @$el.html(row.el)
            row.render()
            return @


    { Header }
