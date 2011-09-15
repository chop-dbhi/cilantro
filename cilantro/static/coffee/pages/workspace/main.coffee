define [
        'cilantro/types/report/models'
        'cilantro/types/scope/models'
        'cilantro/types/perspective/models'
        'cilantro/types/report/views'
        'cilantro/pages/workspace/session'
    ],

    (Report, Scope, Perspective, ReportViews, Views) ->

        reports = new Report.Collection

        sessionReport = new Report.Session
        sessionScope = new Scope.Session
        sessionPerspective = new Perspective.Session

        $ ->

            ReportList = new ReportViews.List
                collection: reports

            SessionScope = new Views.Scope
                model: sessionScope

            SessionPerspective = new Views.Perspective
                model: sessionPerspective

            SessionReport = new Views.Report
                model: sessionReport

            reports.fetch()
            sessionReport.fetch()
            sessionScope.fetch()
            sessionPerspective.fetch()
