define [
        'common/views/collection'
        'cilantro/utils/logging'
        'cilantro/types/report/main'
    ],

    (CollectionViews, Logging, Report) ->

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


        class UnsavedReport extends Logging.MessageView
            template: _.template Report.Messages.UnsavedReportTemplate


        class ReportView extends Backbone.View
            el: '#session-report'

            elements:
                '[role=name]': 'name'
                '[role=modified]': 'modified'
                '[role=timesince]': 'timesince'

            events:
                'click .timestamp': 'toggleTime'

            initialize: ->
                @message = new UnsavedReport(model: @model).render()

                @model.bind 'change', @render

                @model.bind 'change:name', (model, value) =>
                    @message.el.find('[role=name]').text(value)

                @model.bind 'change:has_changed', @hasChanged

            render: =>
                if (name = @model.get 'name')
                    @name.text(name).attr('href', @model.get('report_url')).show()
                    if @model.get 'has_changed'
                        @name.after(' <span class="info">modified</span>')
                else
                    @name.hide()
                @modified.text @model.get('modified')
                @timesince.text @model.get('timesince')

            hasChanged: (model, value, options) =>
                if value is true
                    App.hub.publish 'log', @message
                else
                    App.hub.publish 'dismiss', @message

            toggleTime: ->
                @modified.toggle()
                @timesince.toggle()



        return {
            Report: ReportView
            Scope: ScopeView
            Perspective: PerspectiveView
        }

