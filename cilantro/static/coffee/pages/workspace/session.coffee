define [
        'common/views/collection'
    ],

    (CollectionViews) ->

        class ScopeView extends CollectionViews.ExpandableList
            el: '#session-scope'

            defaultContent: '<li class="info">No conditions have been defined</li>'

            initialize: ->
                @model.bind 'change:conditions', @render
                @defaultContent = @$(@defaultContent)
                @el.append(@defaultContent)

            render: =>
                conditions = @model.get 'conditions'
                @defaultContent.detach()
                @el.empty()
                if conditions
                    text = ''
                    _.map(conditions, (node) -> text += "<li>#{node.condition}</li>")
                    @el.html text
                else
                    @el.append(@defaultContent)
                @collapse()


        class PerspectiveView extends CollectionViews.ExpandableList
            el: '#session-perspective'

            defaultContent: '<li class="info">No data columns have been choosen</li>'

            initialize: ->
                @model.bind 'change:header', @render
                @defaultContent = @$(@defaultContent)
                @el.append(@defaultContent)

            template: _.template '<li><%= name %><% if (direction) { %>
                <span class="info">(<%= direction %>)</span><% } %></li>'

            render: =>
                @defaultContent.detach()
                @el.empty()
                if (header = @model.get 'header')
                    for col in header
                        @el.append @template col
                else
                    @el.append(@defaultContent)
                @collapse()


        class ReportView extends Backbone.View
            el: '#session-report'

            elements:
                '[role=name]': 'name'
                '[role=modified]': 'modified'
                '[role=timesince]': 'timesince'

            events:
                'click .timestamp': 'toggleTime'

            initialize: ->
                @model.bind 'change', @render

            render: =>
                if @model.hasChanged 'name'
                    @name.text(@model.get 'name').attr('href', @model.get('permalink')).parent().show()
                else if not @model.get 'name'
                    @name.parent().hide()

                @modified.text @model.get('modified')
                @timesince.text @model.get('timesince')

            toggleTime: ->
                @modified.toggle()
                @timesince.toggle()


        return {
            Report: ReportView
            Scope: ScopeView
            Perspective: PerspectiveView
        }

