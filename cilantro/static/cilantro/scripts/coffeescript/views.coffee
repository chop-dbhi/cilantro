define ['environ', 'mediator', 'jquery', 'use!underscore', 'use!backbone', 'charts'], (environ, mediator, $, _, Backbone, Charts) ->

    class Container extends Backbone.View
        className: 'area-container'

        template: _.template '
            <div class=heading></div>
            <div class=content></div>
        '

        initialize: ->
            @$el.html @template()
            @heading = @$el.find '.heading'
            @content = @$el.find '.content'


    class QueryView extends Backbone.View
        template: _.template '
            <div class="area-container queryview">
                <div class=heading>
                    {{ name }} <small>{{ category }}</small>
                </div>
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
                form = new FilterForm
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



    accordianGroupTmpl = _.template '
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
                    group = $ accordianGroupTmpl
                        name: groupName
                        parent: id
                        slug: "#{ id }-#{ groupName.toLowerCase() }"
                    @$el.append group
                group.find('.nav').append $ "<li><a href=# data-toggle=queryview data-target=#{ model.id }>#{ model.get 'name' }</a> <i class=icon-filter></i></li>"
            return @$el
        
        showQueryview: (event) ->
            event.preventDefault()
            targetId = $(event.target).data('target')
            mediator.publish "queryview", targetId, 'show'



    class FilterForm extends Backbone.View
        tagName: 'form'

        events:
            'submit': 'preventDefault'
            'click [name=filter]': 'applyFilter'
            'click [name=exclude]': 'applyExclude'

        template: _.template '
            <div class=fieldsets></div>
            <button class="btn success" name=filter>Filter</button>
            <button class="btn danger" name=exclude>Exclude</button>
        '

        initialize: ->
            @$el.html @template()
            @filterButton = @$el.find '[name=filter]'
            @excludeButton = @$el.find '[name=exclude]'

            fieldsets = @$el.find '.fieldsets'

            @fieldsets = {}
            for model in @collection.models
                if model.get('data').enumerable
                    view = new MultiEnumFieldSet
                        model: model
                else if model.get('data').type is 'number'
                    view = new NumberFieldSet
                        model: model
                else
                    view = new FilterFieldSet
                        model: model

                fieldsets.append view.$el
                @fieldsets[model.id] = view

        preventDefault: (event) ->
            event.preventDefault()

        applyFilter: ->

        applyExclude: ->


    class FilterFieldSet extends Backbone.View
        tagName: 'fieldset'

        template: _.template '
            <select name=operator></select>
            <input name=value>
        '

        initialize: (options) ->
            @$el.html @template()
            @operator = @$el.find '[name=operator]'
            @value = @$el.find '[name=value]'

            # Populate the operators
            $.each @model.get('operators'), (i, choice) =>
                option = $ "<option value=\"#{ choice[0] }\">#{ choice[1] }</option>"
                @operator.append option

        render: (filter) ->
            if filter
                @filter = filter
                @setOperator()
                @setValue()

        getOperator: ->
            @operator.val()

        getValue: ->
            @value.val()

        setOperator: ->
            @operator.val @filter.get 'operator'

        setValue: ->
            @value.val filter.get 'value'

        applyFilter: ->
            @filter.set
                value: @getValue()
                operator: @getOperator()
                negate: false

        applyExclude: ->
            @filter.set
                value: @getValue()
                operator: @getOperator()
                negate: true


    class NumberFieldSet extends FilterFieldSet
        events:
            'change [name=operator]': 'toggleOperator'

        template: _.template '
            <select name=operator></select>
            <input name=value>
            <input name=value2>
        '

        initialize: ->
            super
            # Hide by default
            @value2 = @$el.find('[name=value2]').hide()

        getValue: ->
            if /between/.test @getOperator()
                [@value.val(), @value2.val()]
            else
                @value.val()

        setValue: ->
            value = @filter.get 'value'
            if /between/.test @filter.get 'operator'
                @value.val value[0]
                @value2.val value[1]
            else
                @value.val value

        toggleOperator: ->
            if /between/.test @getOperator()
                @value2.show()
            else
                @value2.hide()


    class SingleEnumFieldSet extends FilterFieldSet
        template: _.template '
            <select name=value></select>
        '

        initialize: (options) ->
            super
            # Populate the values
            $.each @model.get('data').choices, (i, choice) =>
                option = $ "<option value=\"#{ choice[0] }\">#{ choice[1] }</option>"
                @value.append option


        getOperator: -> 'in'


    class MultiEnumFieldSet extends SingleEnumFieldSet
        template: _.template '
            <select name=value multiple></select>
        '

    { Container, DataFiltersAccordian, FilterForm, FilterFieldSet, NumberFieldSet, SingleEnumFieldSet, MultiEnumFieldSet, QueryView }
