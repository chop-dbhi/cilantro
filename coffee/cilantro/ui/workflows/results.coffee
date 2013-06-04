define [
    '../core'
    '../base'
    '../paginator'
    '../../structs'
    '../../models'
    '../tables'
    '../context'
    '../concept'
    '../exporter'
    'tpl!templates/workflows/results.html'
], (c, base, paginator, structs, models, tables, context, concept, exporter, templates...) ->

    templates = c._.object ['results'], templates


    class ResultsWorkflow extends c.Marionette.Layout
        className: 'results-workflow'

        template: templates.results

        ui:
            columns: '.columns-modal'
            exporter: '.export-modal'

        events:
            'click .columns-modal [data-save]': 'saveColumns'
            'click .toolbar [data-toggle=columns]': 'showColumns'
            'click .export-modal [data-save]': 'exportData'
            'click [data-toggle=export]': 'showExport'

        regions:
            table: '.table-region'
            paginator: '.paginator-region'
            context: '.context-region'
            columns: '.columns-modal .modal-body'
            exporter: '.export-modal .export-type-region'

        startDownload: (url) ->
            window.location = url

        exportData: (event) ->
            sel = $('input[name=export-type-checkbox]:checked')

            if sel.length > 0
                $('.export-modal .alert-block').hide()
                @ui.exporter.modal('hide')
               
                # Introduce an artificial delay in between downloads to avoid
                # blowing out the window location. If the downloads don't
                # complete before the delay, we might see SyntaxErrors caused
                # by JS interpreting the unfinished downloads as unexpected
                # end of input. If the exports begin doing this we will need
                # to increase the delay below or move to a different download
                # method such as injecting iframes into the DOM for each of 
                # the export downloads(which is ugly but would give better
                # progress and error reporting).
                delay = 10000    
                for i in [0..sel.length-1] by 1
                    setTimeout(
                        @startDownload, 
                        i*delay,
                        sel[i].getAttribute('href'))

            else
                $('.export-modal .alert-block #export-error-message').html('An export type must be selected.')
                $('.export-modal .alert-block').show()

        onRender: ->
            @paginator.show new paginator.Paginator
                model: c.data.results

            @context.show new base.LoadView
                message: 'Loading session context...'

            @columns.show new base.LoadView
                message: 'Loading all your query options...'

            @exporter.show new exporter.ExportTypeCollection
                collection: c.data.exporters

            c.data.contexts.ready =>
                @context.show new context.Context
                    model: c.data.contexts.getSession()

            c.data.concepts.ready =>
                c.data.views.ready =>
                    @table.show new tables.Table
                        view: c.data.views.getSession()
                        collection: c.data.results

                    @columns.show new concept.ConceptColumns
                        view: c.data.views.getSession()
                        collection: c.data.concepts.viewable
        
        showExport: ->
            $('.export-modal .alert-block').hide()
            @ui.exporter.modal('show')

        showColumns: ->
            @ui.columns.modal('show')

        saveColumns: ->
            c.publish c.VIEW_SAVE
            @ui.columns.modal('hide')


    { ResultsWorkflow }
