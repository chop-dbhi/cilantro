require [
        'cilantro/types/report/main'
        # needs to be ported
        'cilantro/report/table'
        'cilantro/report/columns'
    ],
        
    (Report, m_table, m_columns) ->

        sessionReport = new Report.Models.Session

        App.hub.subscribe 'session/idle', ->
            sessionReport.stopPolling()

        App.hub.subscribe 'session/resume', ->
            sessionReport.startPolling()

        $ ->
            ReportEditor = new Report.Views.Editor

            ReportName = new Report.Views.Name
                model: sessionReport

            UnsavedReport = new Report.Messages.UnsavedReport
                model: sessionReport

            sessionReport.fetch()

            m_columns.init()
            m_table.init()

            e = $('#export-data')

            e.bind 'click', ->
                e.attr('disabled', true)
                window.location = App.endpoints.session.report + '?data=1&format=csv'
                setTimeout ->
                    e.attr('disabled', false)
                , 5000
                return false
