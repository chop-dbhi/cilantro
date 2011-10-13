define [
        'common/models/polling'
    ],
        
    (polling) ->

        class Report extends Backbone.Model
            url: ->
                if not /\/$/.test (url = super)
                    url += '/'
                return url


        class ReportCollection extends polling.Collection
            url: App.urls.reports
            model: Report
            comparator: (model) ->
                return -Number(new Date model.get 'modified')


        class SessionReport extends polling.Model
            url: App.urls.session.report

            defaults:
                name: 'click to add a name...'
                description: 'click to add a description...'


        return {
            Model: Report
            Collection: ReportCollection
            Session: SessionReport
        }
