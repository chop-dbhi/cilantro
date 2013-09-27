define [
    'backbone'
    'marionette'
], (Backbone, Marionette) ->

    getTitle = (exporterModel) ->
        title = exporterModel.get('title')

        # If the title isn't there, do our best to get something meaningful
        # from the href attribute.
        if not title?
            href = exporterModel.get('href')

            if href?
                if href[href.length - 1] == "/"
                    fields = href.substring(0, href.length-1).split("/")
                else
                    fields = href.split("/")

                if fields? and fields.length > 0
                    title = fields[fields.length - 1].toUpperCase()

                # If we couldn't get the title from the href then use the whole
                # href property to try to give some context to the title.
                else
                    title = "Untitled (#{ href })"

            # If we have reached this point we have no title and no href so
            # we have no idea what this exporter is for so use a generic title.
            else
                title = "Untitled"
        return title


    class ExportType extends Backbone.View
        tagName: 'label'

        className: 'checkbox'

        render: ->
            href = @model.get('href')
            title = getTitle(@model)

            @$el.html("<input type=checkbox name=export-type-checkbox id=export-type-checkbox-#{ title } title='#{ title }' href='#{ href }' /> #{ title }")
            return @


    class EmptyExportType extends Backbone.View
        className: 'empty'

        render: ->
            @$el.html 'No exporters found...'
            return @


    class ExportProgress extends Backbone.View
        tagName: 'div'

        initialize: ->
            @$el.addClass("export-status-#{ getTitle(@model) }")

        render: ->
            success = "<span class='label label-success hide'>Done</span>"
            error = "<span class='label label-important hide'>Error</span>"
            timeout = "<span class='label label-warning label-timeout hide'>Request Timed Out</span>"
            loading = "<div class='progress progress-striped active hide'><div class='bar' style='width: 100%;'></div></div>"
            pending = "<div class=pending-container><span class=pending-spinner></span> Pending...</div>"

            @$el.html("<div class=span2>#{ getTitle(@model) }:</div><div class=span10>#{ success }#{ error }#{ timeout }#{ loading }#{ pending }</div>")


    class ExportTypeCollection extends Marionette.CollectionView
        tagName: 'div'

        itemView: ExportType

        emptyView: EmptyExportType


    class ExportProgressCollection extends Marionette.CollectionView
        tagName: 'div'

        className: 'export-status-container'

        itemView: ExportProgress

    { ExportType, EmptyExportType, ExportProgress, ExportTypeCollection, ExportProgressCollection}
