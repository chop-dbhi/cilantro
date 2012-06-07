define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'
    'views/charts'
], (environ, mediator, $, _, Backbone, Charts) ->

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
                <div class="content row-fluid">
                    <div class="span6 controls"></div>
                    <div class="span6 charts"></div>
                </div>
            </div>
        '

        events:
            'click [data-toggle=detail]': 'toggleDetail'

        initialize: ->
            attrs =
                name: @model.get 'name'
                category: if (cat = @model.get 'category') then cat.name else ''
                description: @model.get 'description'

            # Reset the element for the template
            @setElement @template attrs

            @$heading = @$el.find '.heading'
            @$content = @$el.find '.content'
            @$details = @$el.find '.details'
            @$controls = @$el.find '.controls'
            @$charts = @$el.find '.charts'

            mediator.subscribe 'queryview', (id, action) =>
                ids = _.pluck @model.get('fields'), 'id'
                if ids.indexOf(id) >= 0 and action is 'show'
                    @visible = true
                    @render()
                else
                    @visible = false
                    @$el.detach()

        toggleDetail: ->
            if @$details.is(':visible')
                @$details.slideUp 300
            else
                @$details.slideDown 300

        render: ->
            # This has not been rendered before
            if not @loaded
                mediator.subscribe 'datacontext/change', @update

                # Create a collection of the fields
                @fieldCollection = new Backbone.Collection @model.get 'fields'

#                # Initialize form
#                form = new Forms.FilterForm
#                    collection: @fieldCollection
#                @$controls.append form.$el

                @charts = []
                @fieldCollection.each (model, i) =>
                    chart = new Charts.Distribution
                        editable: false
                    @charts.push [model, chart]

                    @$charts.append chart.$el

                @pendingUpdate = true
                @loaded = true
            
            if @pendingUpdate
                @update()

            App.router.navigate 'discover'
            App.views.discover.$el.append @$el


        update: =>
            if @visible
                for [model, chart] in @charts
                    url = environ.absolutePath("/api/fields/#{ model.id }/dist/")
                    chart.renderChart url, null, [model]
            else
                @pendingUpdate = true
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

            for model in @collection.models
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
            targetId = $(event.target).data('target')
            mediator.publish 'queryview', targetId, 'show'


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
