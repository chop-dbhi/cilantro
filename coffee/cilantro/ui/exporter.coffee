define [
    './core'
], (c) ->

    class ExportType extends c.Backbone.View
        tagName: 'label'
        
        className: 'radio'

        render: ->
            title = @model.get('title') or 'untitled'

            @$el.html("<input type=radio name=export-type-radio id=export-type-radio-#{ title } href='#{ @model.get('href')}' /> #{ title }")
            return @

    class EmptyExportType extends c.Backbone.View
        className: 'empty'

        render: ->
            @$el.html 'No exporters found...'
            return @

    class ExportTypeCollection extends c.Marionette.CollectionView
        tagName: 'div'

        itemView: ExportType

        emptyView: EmptyExportType

    { ExportType, EmptyExportType, ExportTypeCollection}
