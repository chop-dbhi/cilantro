define [
        'common/models/polling'
    ],
        
    (polling) ->

        class Report extends Backbone.Model


        class ReportCollection extends polling.Collection
            url: App.urls.reports
            model: Report


        class SessionReport extends polling.Model
            url: App.urls.session.report

            defaults:
                name: 'click to add a name...'
                description: 'click to add a description...'

            initialize: ->
                # prevent the initial change event (when fetched), triggers a save
                # to occur. thus we bind it after the initial fetch
                @bind 'change', ->
                    @unbind 'change'
                    @bind 'change', @save

                super


        return {
            Model: Report
            Collection: ReportCollection
            Session: SessionReport
        }
