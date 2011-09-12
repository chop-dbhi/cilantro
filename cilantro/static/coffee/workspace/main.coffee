define ['cilantro/workspace/report', 'cilantro/workspace/session'], (report, session) ->

    $ ->

        reports = new report.Collection

        ReportList = new report.CollectionView
            collection: reports

        reports.fetch()

        sessionReport = new session.Report

        SessionScope = new session.ScopeView
            model: sessionReport

        SessionPerspective = new session.PerspectiveView
            model: sessionReport

        SessionReport = new session.ReportView
            model: sessionReport

        sessionReport.fetch()
