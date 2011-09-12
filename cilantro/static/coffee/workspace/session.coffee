define ['common/models/polling'], (polling) ->

    class Report extends polling.Model
        url: App.urls.session.report


    class ScopeView extends Backbone.View
        el: '#session-scope'

        initialize: ->
            @model.bind 'change:scope', @render

        render: => @el.html @model.get('scope').text or '<li class="info">No conditions have been defined</li>'


    class PerspectiveView extends Backbone.View
        el: '#session-perspective'

        initialize: ->
            @model.bind 'change:perspective', @render

        template: _.template '<li><%= name %><% if (direction) { %> <span class=\"info\">(direction)</span><% } %></li>'

        render: =>
            @el.empty()
            for col in @model.get('perspective').header
                @el.append @template col


    class ReportView extends Backbone.View
        el: '#session-report'

        elements:
            '[role=modified]': 'modified'
            '[role=timesince]': 'timesince'

        events:
            'click .timestamp': 'toggleTime'

        initialize: ->
            @model.bind 'change', @render

        render: =>
            @modified.text @model.get('modified')
            @timesince.text @model.get('timesince')


        toggleTime: ->
            @modified.toggle()
            @timesince.toggle()


    return {
        Report: Report
        ReportView: ReportView
        ScopeView: ScopeView
        PerspectiveView: PerspectiveView
    }

