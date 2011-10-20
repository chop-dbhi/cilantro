define [
        'common/views/collection'
        'cilantro/types/report/main'
    ],

    (CollectionViews, Report) ->

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


        class ReportView extends Report.Views.Item
            el: '<div>
                    <strong><a role="name"></a></strong>
                    <span class="info">- <span role="unique-count"></span> unique patients</span>
                    <span class="info time" style="float: right">modified <span role="modified"></span><span role="timesince"></span></span>
                    <div role="description"></div>
                </div>'

            parent: '#session-report'

            initialize: ->
                @el.prependTo(@parent)
                @model.bind 'change', @render

            render: =>
                super
                name = @model.get 'name'
                if @model.hasChanged('name') and name
                    @name.text(name).attr('href', @model.get('permalink')).parent().show()
                else if not name
                    @name.text('(session report)')


        return {
            Report: ReportView
            Scope: ScopeView
            Perspective: PerspectiveView
        }

