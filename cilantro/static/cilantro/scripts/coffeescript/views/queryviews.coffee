define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'
    'serrano'
    'charts'
    'forms/controls'
], (environ, mediator, $, _, Backbone, Serrano, Charts, Controls) ->

    class QueryView extends Backbone.View
        template: _.template '
            <div class="area-container queryview">
                <h3 class=heading>
                    {{ name }} <small>{{ category }}</small>
                </h3>
                <div class=btn-toolbar>
                    <button data-toggle=detail class="btn btn-small"><i class=icon-info-sign></i> Info</button>
                    <button data-toggle=hide class="btn btn-small"><i class=icon-minus></i> Hide</button>
                </div>
                <div class=details>
                    <div class=description>{{ description }}</div>
                </div>
                <form class=form-inline>
                </form>
            </div>
        '

        events:
            'click [data-toggle=hide]': 'toggleHide'
            'click [data-toggle=detail]': 'toggleDetail'
            'submit form,button,input,select': 'preventDefault'

        deferred:
            update: true

        initialize: ->
            super

            attrs =
                name: @model.get 'name'
                category: if (cat = @model.get 'category') then cat.name else ''
                description: @model.get 'description'

            # Reset the element for the template
            @setElement @template attrs

            @$form = @$ 'form'
            @$heading = @$ '.heading'
            @$details = @$ '.details'

            # Subscribe to when the queryview should render/show itself
            mediator.subscribe 'queryview/show', (id) =>
                if @model.id is id then @show()

            # Subscribe to when the queryview should hide itself
            mediator.subscribe 'queryview/hide', (id) =>
                if @model.id is id then @hide()

            @render()

        preventDefault: (event) ->
            event.preventDefault()

        # Toggle the details of the concept
        toggleDetail: ->
            if @$details.is(':visible')
                @$details.slideUp 300
            else
                @$details.slideDown 300

        toggleHide: (event) ->
            event.preventDefault()
            mediator.publish 'queryview/hide', @model.id

        render: ->
            # Create a collection of the fields
            fields = new Backbone.Collection @model.get 'fields'

            @controls = []
            @charts = []

            options =
                label: if fields.length is 1 then false else true

            for model in fields.models
                options.model = model

                $controls = $ '<div></div>'

                attrs = model.attributes
                if attrs.simple_type is 'boolean'
                    controlClass = Controls.BooleanControl
                else if attrs.enumerable
                    controlClass = Controls.EnumerableControl
                else if attrs.searchable
                    controlClass = Controls.SearchableControl
                else if attrs.simple_type is 'number'
                    controlClass = Controls.NumberControl
                else
                    controlClass = Controls.Control

                if model.get('_links').distribution
                    chart = new Charts.DistributionChart
                        editable: false
                        data:
                            context: null
                else
                    chart = null

                @controls.push (control = new controlClass options)
                @charts.push [model, chart]

                $controls.append control.render()
                @$form.append $controls
                if chart then @$form.append chart.render()

            # Subscribe to the session datacontext
            mediator.subscribe Serrano.DATACONTEXT_SYNCED, (model) =>
                if model.isSession()
                    for control in @controls
                        if (conditions = model.getNodes(control.model.id)) and conditions[0]
                            control.set conditions[0]
            @update()
            @$el

        show: =>
            @resolve()
            # Move to the top
            $parent = $('#discover-area')
            @$el.prependTo $parent
            (control.show() for control in @controls)
            return @

        hide: =>
            reset =
                top: 'auto'
                left: 'auto'
                zIndex: 'auto'
                position: @$el.css 'position'

            offset = @$el.offset()
            @$el.css
                top: offset.top
                left: offset.left
                position: 'fixed'
                zIndex: -1

            @$el.animate
                top: -@$el.height()
            ,
                duration: 600
                easing: 'easeOutQuad'
                complete: => @$el.detach().css reset
            @pending()
            return @

        update: =>
            for [model, chart] in @charts
                if chart
                    url = model.get('_links').distribution.href
                    chart.update url, null, [model]
            return


    class ConceptItemView extends Backbone.View
        tagName: 'li'

        events:
            'click a': 'click'

        initialize: ->
            # Reflect the active state when the shown
            mediator.subscribe 'queryview/show', (id) =>
                if id is @model.id
                    @$el.addClass 'active'
                else
                    @$el.removeClass 'active'

            # Reflect the non-active state when hidden
            mediator.subscribe 'queryview/hide', (id) =>
                if id is @model.id then @$el.removeClass 'active'

        render: ->
            if not @model.get 'published'
                @$el.addClass('staff-only').attr('data-placement', 'right')
            @$el.html "<a href=#>#{ @model.get 'name' }</a>"

        click: (event) ->
            event.preventDefault()
            mediator.publish 'queryview/show', @model.id


    # Accordian representation of the data filters
    class QueryViewsAccordian extends Backbone.View
        id: 'data-filters-accordian'

        className: 'accordian'

        events:
            'click .accordian-toggle': 'toggleCaret'

        groupTemplate: _.template '
            <div class=accordian-group>
                <div class=accordian-heading>
                    <a class=accordian-toggle data-toggle=collapse href="#category-{{ id }}">{{ name }}</a>
                    <b class="caret closed"></b>
                </div>
                <div id="category-{{ id }}" class="accordian-body collapse">
                    <ul class="nav nav-list"></ul>
                </div>
            </div> 
        '

        initialize: ->
            @$el.addClass 'loading'

            @collection.when =>
                @$el.removeClass 'loading'
                @render()
                @collection.each (model, i) ->
                    if model.get 'queryview'
                        new QueryView model: model

        render: ->
            tree = categories: []

            for model in @collection.models
                if not model.get 'queryview' then continue
                attrs = model.attributes

                cat = null
                sub = id: null

                if attrs.category
                    if attrs.category.parent
                        cat = attrs.category.parent
                        sub = attrs.category
                    else
                        cat = attrs.category
                    
                if not (subtree = tree[cat.id])
                    tree.categories.push cat
                    subtree = tree[cat.id] = categories: []
                if not (models = subtree[sub.id])
                    if sub.id then subtree.categories.push sub
                    models = subtree[sub.id] = []

                # Models will be sorted relative to their groups later
                models.push model


            # Build the DOM tree
            cats = _.sortBy tree.categories, 'order'
            if tree[null] then cats.push null

            # Process each category in the tree
            for cat in cats
                if not cat
                    cat = id: null, name: 'Other'

                $group = $ @groupTemplate cat
                @$el.append $group
                $list = $group.find '.accordian-body ul'

                subtree = tree[cat.id]
                subcats = _.sortBy subtree.categories, 'order'
                if subtree[null] then subcats.push null

                # Process each category in the subtree
                for sub in subcats
                    if sub
                        id = sub.id
                        name = sub.name
                    else
                        id = null
                        name = 'Other'

                    # Add section header in group list
                    $list.append "<li class=nav-header>#{ name }</li>"
                    $list.append "<li class=divider>#{ name }</li>"

                    models = subtree[id]

                    for model in models
                        view = new ConceptItemView model: model
                        $list.append view.render()

                if subcats.length is 1
                    $list.find('.nav-header').remove()
                    $list.find('.divider').remove()
                    
            # Single category items, hide the only group
            # heading for simplicity
            if cats.length is 1
                $group.find('.accordian-heading').remove()
                $group.find('.accordian-body').removeClass('collapse')

            return @$el

        toggleCaret: (event) ->
            target = $(event.target)
            target.siblings('.caret').toggleClass('closed')


    # Represents a search form that will filter down the query options
    class QueryViewsSearchForm extends Backbone.View
        template: _.template '
            <form id=data-filters-search class=form-search action=>
                <input type=text class=search-query placeholder=Search>
            </form>
        '

        events:
            'keyup input': 'autocomplete'
            'submit': 'search'

        initialize: ->
            @setElement @template()

        autocomplete: ->

        search: ->
    

    # Renders the panel which displays all the available query options
    class QueryViewsPanel extends Backbone.View
        template: _.template '
            <div id=data-filters-panel class="panel panel-left scrollable-column closed">
                <div class="inner panel-content"></div>
                <div class=panel-toggle></div>
            </div>
        '

        initialize: (options) ->
            @setElement @template()
            content = @$('.panel-content')

            @browser = new QueryViewsAccordian
                collection: @collection

            # Enable search, the collection is expected to provide a
            # search API
            if options.enableSearch
                @form = new QueryViewsSearchForm
                    collection: @collection
                content.append @form.el

            content.append @browser.el

            $('body').append @$el
            @$el.panel()


    class QueryViewFilterList extends Backbone.View
        events:
            'click [data-toggle=clear]': 'clear'

        # FIXME: this button assumes the data route to be 'review/' which
        # is a hard-coded assumption
        template: _.template '
            <div id=data-filters-list-panel class="panel panel-right scrollable-column closed">
                <div class="inner panel-content">
                    <div class=actions>
                        <button data-route="review/" class="btn btn-small btn-primary">View Results</button>
                        <button data-toggle=clear class="btn btn-small btn-danger pull-right" title="Clear All">
                            <i class="icon-ban-circle icon-white"></i>
                        </button>
                    </div>
                    <div class=filters></div>
                </div>
                <div class=panel-toggle></div>
            </div>
        '

        initialize: (options) ->
            @setElement @template()
            @$filters = @$('.filters')
            $('body').append @$el
            @$el.panel()

            mediator.subscribe Serrano.DATACONTEXT_SYNCING, =>
                @$filters.addClass 'loading'

            mediator.subscribe Serrano.DATACONTEXT_SYNCED, (model) =>
                if model.isSession() then @render(model)

        _parse: (node, html=[]) ->
            if node.children
                html.push "<ul><li class=nav-header>#{ node.type }'ed</li>"
                for child in node.children
                    @_parse child, html
                html.push "</ul>"
            else
                if not html.length
                    html.push "<ul>"
                html.push "<li>#{ node.language }</li>"
                if not html.length
                    html.push "</ul>"

            return html

        render: (model) =>
            @$filters.empty()

            # Append actions
            @$filters.removeClass 'loading'
            node = model.get('language')

            # Not filters
            if not node or _.isEmpty(node)
                @$filters.append '
                    <div class=muted>
                        <h4>No filters are applied</h4>
                        <p>Explore the available filters on the left side
                            or click "View Results" to immediately see some
                            data.</p>
                    </div>
                '
            else
                ul = $(@_parse(node).join '').addClass 'unstyled nav-list'
                @$filters.append ul

            return @$el


        clear: (event) ->
            event.preventDefault()
            mediator.publish Serrano.DATACONTEXT_CLEAR

    {
        View: QueryView
        Panel: QueryViewsPanel
        SearchForm: QueryViewsSearchForm
        Accordian: QueryViewsAccordian
        List: QueryViewFilterList
    }
