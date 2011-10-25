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
            url: App.endpoints.reports
            model: Report
            comparator: (model) ->
                return -Number(new Date model.get 'modified')


        class SessionReport extends polling.Model
            url: App.endpoints.session.report

            defaults:
                name: 'click to give your report a name...'
                description: 'click to give your report a description...'

            initialize: ->
                super

                # Provides a simple way for clearing out the session object
                # enabling new reports
                App.hub.subscribe 'report/clear', =>
                    @clear silent: true
                    @save null,
                        success: -> window.location = App.endpoints.define

                # subscribe to report changes so if the reference changes,
                # it is immediately updated here on the session model
                App.hub.subscribe 'report/change', (model) =>
                    if model.id is @get 'reference_id'
                        @set model.toJSON()

            push: ->
                @save null,
                    url: @get('permalink')
                    success: ->
                        App.hub.publish 'report/push', @

            revert: ->
                @save null,
                    data: JSON.stringify(revert: true)
                    contentType: 'application/json'
                    success: ->
                        App.hub.publish 'report/revert', @


        return {
            Model: Report
            Collection: ReportCollection
            Session: SessionReport
        }
