define [
        'cilantro/types/report/main'
        'cilantro/types/scope/main'
        'cilantro/types/perspective/main'
        'cilantro/pages/workspace/session'
    ],

    (Report, Scope, Perspective, Views) ->

        reports = new Report.Models.Collection

        sessionReport = new Report.Models.Session
        sessionScope = new Scope.Models.Session
        sessionPerspective = new Perspective.Models.Session

        App.hub.subscribe 'session/idle', ->
            reports.stopPolling()
            sessionReport.stopPolling()
            sessionScope.stopPolling()
            sessionPerspective.stopPolling()

        App.hub.subscribe 'session/resume', ->
            reports.startPolling()
            sessionReport.startPolling()
            sessionScope.startPolling()
            sessionPerspective.startPolling()

        $ ->

            ReportEditor = new Report.Views.Editor

            ReportList = new Report.Views.List
                collection: reports

            SessionScope = new Views.Scope
                model: sessionScope

            SessionPerspective = new Views.Perspective
                model: sessionPerspective

            SessionReport = new Views.Report
                model: sessionReport

            UnsavedReport = new Report.Messages.UnsavedReport
                model: sessionReport

            reports.fetch()
            sessionReport.fetch()
            sessionScope.fetch()
            sessionPerspective.fetch()
