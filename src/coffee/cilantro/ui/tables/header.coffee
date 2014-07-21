define [
    'underscore'
    'marionette'
    './row'
], (_, Marionette, row) ->

    class HeaderCell extends Marionette.ItemView
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

        # Finds and returns the sort icon html associatied with the sort
        # direction of the Facet being represented by this header cell.
        getSortIconClass: ->
            model = _.find @view.facets.models, (m) =>
                @model.id is m.get('concept')

            # If there are no view facets for the this header cell's model
            # then the this really shouldn't be displaying anyway so return
            # the empty string. We really should not ever get into this
            # situation since the facets should be driving the columns but
            # this check prevents TypeErrors just in case.
            if not model? then return

            direction = (model.get('sort') or '').toLowerCase()

            return switch direction
                when 'asc' then 'icon-sort-up'
                when 'desc' then 'icon-sort-down'
                else 'icon-sort'

        render: ->
            @toggleVisible()

            iconClass = @getSortIconClass()

            # TODO: Could we use a template here instead and then just modify
            # the class on the icon in the template?
            @$el.html("<span>#{ @model.get('name') } <i class=#{ iconClass }></i></span>")
            @$el.attr('title', @model.get('name'))

            return @

        toggleVisible: ->
            @$el.toggle(@model.get 'visible')


    class HeaderRow extends row.Row
        itemView: HeaderCell


    class Header extends Marionette.ItemView
        tagName: 'thead'

        initialize: ->
            offset = 0
            for field, i in $('.navbar-fixed-top')
                offset += field.clientHeight

            @$el.css('top', offset)
            @$el.css('background-color', 'white')
            @$el.addClass('navbar-fixed-top')

        render: ->
            row = new HeaderRow _.extend {}, @options,
                collection: @collection
            @$el.html(row.el)
            row.render()
            return @


    { Header }
