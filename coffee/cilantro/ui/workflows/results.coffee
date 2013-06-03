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

        exportData: (event) ->
            sel = $('input[name=export-type-radio]:checked')

            if sel.length > 0
                $('.export-modal .alert-block').hide()
                $('.export-modal').hide()
                window.location = sel.attr('href')
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
