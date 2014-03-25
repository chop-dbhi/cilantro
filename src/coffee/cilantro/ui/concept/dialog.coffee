define [
    'underscore'
    'marionette'
    './columns'
], (_, Marionette, columns) ->

    class ColumnsDialog extends Marionette.Layout
        className: 'columns-modal modal hide full'

        template: 'concept/columns-dialog'

        events:
            'click [data-save]': 'save'
            'click [data-dismiss]': 'cancel',

        regions:
            body: '.modal-body'

        initialize: ->
            @data = {}

            if not (@data.view = @options.view)
                throw new Error 'view required'

            if not (@data.concepts = @options.concepts)
                throw new Error 'concepts collection required'

        onRender: ->
            @$el.modal
                show: false
                keyboard: false
                backdrop: 'static'


            columns = new columns.ConceptColumns
                view: @data.view
                concepts: @data.concepts

            this.body.show(columns)

        cancel: ->
            _.delay =>
                @body.currentView.resetFacets()
            , 25

        save: ->
            @data.view.facets.reset(@body.currentView.data.facets.toJSON())
            @data.view.save()
            @close()

        open: ->
            @$el.modal('show')

        close: ->
            @$el.modal('hide')


    { ColumnsDialog }
