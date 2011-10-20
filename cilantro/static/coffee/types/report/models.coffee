define [
        'common/models/polling'
    ],
        
    (polling) ->

        class Report extends Backbone.Model
            url: ->
                if not /\/$/.test (url = super)
                    url += '/'
                return url

            initialize: ->
                @bind 'change', -> App.hub.publish 'report/change', @


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

            initialize: ->
                super

                # Provides a simple way for clearing out the session object
                # enabling new reports
                App.hub.subscribe 'report/clear', =>
                    @clear silent: true
                    @save null, success: -> window.location = App.urls.define

                # subscribe to report changes so if the reference changes,
                # it is immediately updated here on the session model
                App.hub.subscribe 'report/change', (model) =>
                    if model.id is @get 'reference_id'
                        @set model.toJSON()


        return {
            Model: Report
            Collection: ReportCollection
            Session: SessionReport
        }
