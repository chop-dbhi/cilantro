define [
    './core'
], (c) ->

    class ExportType extends c.Backbone.View
        tagName: 'label'
        
        className: 'radio'

        render: ->
            title = @model.get('title')
            href = @model.get('href')

            # If the title isn't there, do our best to get something meaningful from the href attribute
            if not title?
                if href[href.length - 1] == "/"
                    fields = href.substring(0, href.length-1).split("/")
                else 
                    fields = href.split("/")

                if fields? and fields.length > 0
                    title = fields[fields.length - 1].toUpperCase()
                # If all else fails, just admit defeat and jam the href into a non-descript Untitled label
                else
                    title = "Untitled (#{ href })"

            @$el.html("<input type=radio name=export-type-radio id=export-type-radio-#{ title } href='#{ href }' /> #{ title }")
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
