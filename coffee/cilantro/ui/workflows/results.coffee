define [
    '../core'
    '../base'
    '../paginator'
    '../../structs'
    '../../models'
    '../tables'
    '../context'
    '../concept'
    'tpl!templates/workflows/results.html'
], (c, base, paginator, structs, models, tables, context, concept, templates...) ->

    templates = c._.object ['results'], templates


    class ResultsWorkflow extends c.Marionette.Layout
        className: 'results-workflow'

        template: templates.results

        ui:
            columns: '.columns-modal'

        events:
            'click .columns-modal [data-save]': 'saveColumns'
            'click .toolbar [data-toggle=columns]': 'showColumns'

        regions:
            table: '.table-region'
            paginator: '.paginator-region'
            context: '.context-region'
            columns: '.columns-modal .modal-body'

        onRender: ->
            @paginator.show new paginator.Paginator
                model: c.data.results

            @context.show new base.LoadView
                message: 'Loading session context...'

            @columns.show new base.LoadView
                message: 'Loading all your query options...'

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

        showColumns: ->
            @ui.columns.modal('show')

        saveColumns: ->
            c.publish c.VIEW_SAVE
            @ui.columns.modal('hide')


    { ResultsWorkflow }
