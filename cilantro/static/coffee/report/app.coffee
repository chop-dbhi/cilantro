    $ ->
        App.report = new Report

        App.report.fetch
            success: (model) ->
                App.ReportName = new ReportName
                    model: model
                # App.ReportInfo = new ReportInfo
                #     model: model

