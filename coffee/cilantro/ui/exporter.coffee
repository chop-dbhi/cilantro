define [
    './core'
], (c) ->

    class ExportType extends c.Backbone.View
        tagName: 'label'
        
        className: 'checkbox'

        render: ->
            title = @model.get('title') or 'untitled'

            @$el.html("<input type=checkbox name=export-type-check id=export-type-check-#{ title } checked /> #{ title }")
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
