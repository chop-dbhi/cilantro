define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'
    'serrano/channels'
    'views/charts'
    'forms/controls'
], (environ, mediator, $, _, Backbone, channels, Charts, Controls) ->

    class QueryView extends Backbone.View
        template: _.template '
            <div class="area-container queryview">
                <h3 class=heading>
                    {{ name }} <small>{{ category }}</small>
                </h3>
                <div class=btn-toolbar>
                    <button data-toggle=detail class="btn btn-small"><i class=icon-info-sign></i></button>
                </div>
                <div class=details>
                    <div class=description>{{ description }}</div>
                </div>
                <form class=form-inline>
                </form>
            </div>
        '

        events:
            'submit form,button,input,select': 'preventDefault'
            'click [data-toggle=detail]': 'toggleDetail'

        deferred:
            'update': true

        initialize: ->
            super

            attrs =
                name: @model.get 'name'
                category: if (cat = @model.get 'category') then cat.name else ''
                description: @model.get 'description'

            # Reset the element for the template
            @setElement @template attrs

            @$heading = @$ '.heading'
            @$details = @$ '.details'
            @$form = @$ 'form'

            # Subscribe to when the queryview should render/show itself
            mediator.subscribe 'queryview/show', (id) =>
                if @model.id is id then @show()

            @render()

        preventDefault: (event) ->
            event.preventDefault()

        # Toggle the details of the concept
        toggleDetail: ->
            if @$details.is(':visible')
                @$details.slideUp 300
            else
                @$details.slideDown 300

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
                    chart = new Charts.Distribution
                        editable: false
                        data:
                            context: null
                else
                    chart = null

                @controls.push (control = new controlClass options)
                @charts.push [model, chart]

                $controls.append control.render().$el
                @$form.append $controls, chart.$el

            # Subscribe to the session datacontext
            mediator.subscribe channels.DATACONTEXT_SYNCED, (model) =>
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
            @pending()
            @$el.detach()
            (control.hide() for control in @controls)
            return @

        update: =>
            for [model, chart] in @charts
                url = model.get('_links').distribution.href
                chart.renderChart url, null, [model]
            return


    # Accordian representation of the data filters
    class QueryViewsAccordian extends Backbone.View
        id: 'data-filters-accordian'

        className: 'accordian'

        groupTemplate: _.template '
            <div class=accordian-group>
                <div class=accordian-heading>
                    <a class=accordian-toggle data-toggle=collapse data-parent={{ parent }} href=#{{ slug }}>{{ name }}</a>
                    <i class=icon-filter></i>
                </div>
                <div id={{ slug }} class="accordian-body collapse">
                    <ul class=nav></ul>
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

        events:
            'click [data-toggle=queryview]': 'show'

        render: ->
            @$el.empty()

            # Keep track if there are any categories. If none are present,
            # remove the header and uncollpase the list
            noCategories = true

            sorted = @collection.sortBy (model) ->
                category = model.get('category')
                if category
                    noCategories = false
                    parseInt("#{category.order}000#{model.order}")
                else
                    model.order or model.name

            for model in sorted
                if not model.get 'queryview' then continue
                if noCategories
                    if not group
                        group = $ @groupTemplate
                            name: ''
                            parent: 0
                            slug: "#{ 0 }-default"
                        group.find('.accordian-heading').remove()
                        group.find('.accordian-body').removeClass('collapse')
                        @$el.append group
                else
                    category = model.get('category')
                    categoryName = if category then category.name else 'Other'

                    if not groupName or categoryName isnt groupName
                        groupName = categoryName
                        id = @$el.prop('id')
                        group = $ @groupTemplate
                            name: groupName
                            parent: id
                            slug: "#{ id }-#{ groupName.toLowerCase() }"
                        @$el.append group

                group.find('.nav').append $ "
                    <li><a href=# data-toggle=queryview data-target=#{ model.id }>#{ model.get 'name' }</a>
                        <i class=icon-filter></i>
                    </li>
                "

            return @
        
        show: (event) ->
            event.preventDefault()
            mediator.publish 'queryview/show', $(event.target).data('target')


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
        template: _.template '
            <div id=data-filters-list-panel class="panel panel-right scrollable-column closed">
                <div class="inner panel-content"></div>
                <div class=panel-toggle></div>
            </div>
        '

        initialize: (options) ->
            @setElement @template()
            @$content = @$('.panel-content')
            $('body').append @$el
            @$el.panel()

            mediator.subscribe channels.DATACONTEXT_SYNCING, =>
                @$content.addClass 'loading'

            mediator.subscribe channels.DATACONTEXT_SYNCED, (model) =>
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
            @$content.removeClass 'loading'
            node = model.get('language')
            @$content.html '<h3><i class=icon-filter></i> Applied Filters</h3>'

            # Not filters
            if not node or _.isEmpty(node)
                @$content.append '<em>No filters are applied</em>'
            else
                ul = $(@_parse(node).join '').addClass 'nav nav-list'
                @$content.append ul
            @$el


    {
        View: QueryView
        Panel: QueryViewsPanel
        SearchForm: QueryViewsSearchForm
        Accordian: QueryViewsAccordian
        List: QueryViewFilterList
    }
