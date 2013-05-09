define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'
    'views/charts'
    'forms/controls'
], (environ, mediator, $, _, Backbone, Charts, Controls) ->

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
            @$details = @$  '.details'
            @$form = @$ 'form'

            mediator.subscribe 'queryview/show', (id) =>
                if @model.id is id then @show()

            # Should be used only if the UI is relative to the datacontext
            # mediator.subscribe 'datacontext/change', @update

            @render()

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

                $controls = $ '<div class=span6></div>'
                $charts = $ '<div class="span6 charts"></div>'

                if (data = model.get 'data').searchable
                    controlClass = Controls.SearchableControl
                else if data.enumerable
                    controlClass = Controls.EnumerableControl
                else if data.type is 'number'
                    controlClass = Controls.NumberControl
                else
                    controlClass = Controls.Control

                chart = new Charts.Distribution
                    editable: false
                    data:
                        context: null

                @controls.push (control = new controlClass options)
                @charts.push [model, chart]

                $controls.append control.render().$el
                $charts.append chart.$el

                if (conditions = App.DataContext.session.getNodes(model.id)) and conditions[0]
                    control.set conditions[0]

                @$form.append $('<div class=row-fluid>').append($controls, $charts)
                @update()

        show: =>
            @resolve()
            # Move to the top
            App.views.discover.$el.prepend @$el.detach()
            (control.show() for control in @controls)
            return @

        hide: =>
            @pending()
            @$el.detach()
            (control.hide() for control in @controls)
            return @

        update: =>
            for [model, chart] in @charts
                url = environ.absolutePath("/api/fields/#{ model.id }/dist/")
                chart.renderChart url, null, [model]
            return


    # Accordian representation of the data filters
    class QueryViewsAccordian extends Backbone.View
        id: 'data-filters-accordian'

        className: 'accordian'

        grouptTemplate: _.template '
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
            @collection.deferred.done =>
                @render()
                @collection.each (model, i) ->
                    if model.get 'queryview'
                        new QueryView model: model

        events:
            'click [data-toggle=queryview]': 'show'

        render: ->
            @$el.empty()

            for model in @collection.sortBy((model) -> (category = model.get('category'))?.order)
                if not model.get 'queryview' then continue
                category = model.get('category')
                categoryName = if category then category.name else 'Other'

                if not groupName or categoryName isnt groupName
                    groupName = categoryName
                    id = @$el.prop('id')
                    group = $ @grouptTemplate
                        name: groupName
                        parent: id
                        slug: "#{ id }-#{ groupName.toLowerCase() }"
                    @$el.append group

                group.find('.nav').append $ "<li><a href=# data-toggle=queryview data-target=#{ model.id }>#{ model.get 'name' }</a> <i class=icon-filter></i></li>"
            return @
        
        show: (event) ->
            event.preventDefault()
            mediator.publish 'queryview/show', $(event.target).data('target')


    class QueryViewsSearchForm extends Backbone.View
        template: _.template '
            <form id=data-filters-search class=form-search action=>
                <input class=search-query placeholder=Search>
            </form>
        '

        events:
            'keyup input': 'autocomplete'
            'submit': 'search'

        initialize: ->
            @setElement @template()

        autocomplete: ->

        search: ->
    

    class QueryViewsPanel extends Backbone.View
        template: _.template '
            <div id=data-filters-panel class="panel panel-left scrollable-column closed">
                <div class="inner panel-content"></div>
                <div class=panel-toggle data-toggle=panel></div>
            </div>
        '

        initialize: ->
            @setElement @template()

            @$browser = new QueryViewsAccordian
                collection: @collection

            @$form = new QueryViewsSearchForm
                collection: @collection

            @$('.panel-content').append @$form.el, @$browser.el
            $('body').append @$el

            @$el.panel()


    $ ->

        App.QueryViewsPanel = new QueryViewsPanel
            collection: App.DataConcept
