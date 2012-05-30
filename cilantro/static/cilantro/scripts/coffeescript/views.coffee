define [
    'environ'
    'mediator'
    'jquery'
    'use!underscore'
    'use!backbone'
    'templates'
    'views/forms'
    'views/charts'
], (environ, mediator, $, _, Backbone, Templates, Forms, Charts) ->

    class Container extends Backbone.View
        template: Templates.container

        initialize: ->
            @setElement @template()
            @heading = @$el.find '.heading'
            @content = @$el.find '.content'


    class QueryView extends Backbone.View
        template: Templates.queryview

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
                if @model.get('id') is id and action is 'show'
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

        render: (event) ->
            # This has not been rendered before
            if not @loaded
                mediator.subscribe 'datacontext/change', @update

                # Create a collection of the fields
                @fieldCollection = new Backbone.Collection @model.get 'fields'

                # Initialize form
                form = new Forms.FilterForm
                    collection: @fieldCollection
                @$controls.append form.$el

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
    class DataFiltersAccordian extends Backbone.View
        initialize: ->
            @collection.on 'reset', @render

        events:
            'click [data-toggle=queryview]': 'showQueryview'

        render: (collection) =>
            @$el.empty()

            for model in collection.models
                if not model.get 'queryview' then continue
                category = model.get('category')
                categoryName = if category then category.name else 'Other'
                if not groupName or categoryName isnt groupName
                    groupName = categoryName
                    id = @$el.prop('id')
                    group = $ Templates.accordianGroup
                        name: groupName
                        parent: id
                        slug: "#{ id }-#{ groupName.toLowerCase() }"
                    @$el.append group
                group.find('.nav').append $ "<li><a href=# data-toggle=queryview data-target=#{ model.id }>#{ model.get 'name' }</a> <i class=icon-filter></i></li>"
            return @$el
        
        showQueryview: (event) ->
            event.preventDefault()
            targetId = $(event.target).data('target')
            mediator.publish 'queryview', targetId, 'show'



    { Container, DataFiltersAccordian, QueryView }
