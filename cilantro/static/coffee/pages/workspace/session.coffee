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

            render: =>
                conditions = @model.get 'conditions'
                if conditions
                    text = ''
                    _.map(conditions, (node) -> text += "<li>#{node.condition}</li>")
                    @el.html text
                @collapse()


        class PerspectiveView extends CollectionViews.ExpandableList
            el: '#session-perspective'

            defaultContent: '<li class="info">No data columns have been choosen</li>'

            initialize: ->
                @model.bind 'change:header', @render

            template: _.template '<li><%= name %><% if (direction) { %>
                <span class="info">(<%= direction %>)</span><% } %></li>'

            render: =>
                @el.empty()
                for col in @model.get 'header'
                    @el.append @template col
                @collapse()


        class UnsavedReport extends Logging.MessageView
            template: _.template Report.Messages.UnsavedReportTemplate


        class ReportView extends Backbone.View
            el: '#session-report'

            elements:
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

