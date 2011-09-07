###
    Usage:

    $ ->
        App.report = new Report

        App.report.fetch
            success: (model) ->
                App.ReportName = new ReportName
                    model: model

                App.ReportInfo = new ReportInfo
                    model: model
###

define ['common/models/polling'], (polling) ->

    class Report extends polling.Model
        url: App.urls.session.report

        defaults:
            name: 'click to add a name...'
            description: 'click to add a description...'

        initialize: ->
            @bind 'change:name', @save

    return {
        Model: Report
    }
