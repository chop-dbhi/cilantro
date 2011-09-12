define ['common/models/polling', 'common/views/collection', 'vendor/synapse'], (polling, collectionview) ->

    App = window.App
    if not App
        window.App = App = {}


    class Reports extends polling.Collection
        url: App.urls.reports


    class ReportListItem extends Backbone.View
        el: '<li><strong role="name"></strong> - modified '
            '<span role="modified"></span><span role="timesince"></span></li>'

        elements:
            '[role=name]': 'name'
            '[role=modified]': 'modified'
            '[role=timesince]': 'timesince'

        render: ->
            Synapse(@model).notify(@name).notify(@modified)


    class ReportList extends collectionview.View
        el: '#reports ul'
        viewClass: ReportListItem


    class SessionReport extends polling.Model
        url: App.urls.session.report


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




    class ScopeView extends Backbone.View
        el: '#session-scope'

        initialize: ->
            @model.bind 'change:scope', @render

        render: => @el.html @model.get('scope').text or '<li class="info">No conditions have been defined</li>'


    class PerspectiveView extends Backbone.View
        el: '#session-perspective'

        initialize: ->
            @model.bind 'change:perspective', @render

        template: _.template '<li><%= name %><% if (direction) { %> <span class=\"info\">(direction})</span><% } %></li>'

        render: =>
            @el.empty()
            for col in @model.get('perspective').header
                @el.append @template col


#    class SystemStatusStream extends Backbone.Collection

#    class ActivityStream extends Backbone.Collection

    $ ->

        App.reports = new Reports

        App.ReportList = new ReportList
            collection: App.reports

        App.reports.fetch()

        App.session =
            report: new SessionReport

        App.SessionScope = new ScopeView
            model: App.session.report

        App.SessionPerspective = new PerspectiveView
            model: App.session.report

        App.SessionReport = new ReportView
            model: App.session.report

        App.session.report.fetch()
