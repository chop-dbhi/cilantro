define [
    'underscore'
    'marionette'
    '../core'
    './item'
    './dialog'
    'tpl!templates/query/list.html'
], (_, Marionette, c, item, dialog, templates...) ->

    templates = _.object ['list'], templates

    class QueryList extends Marionette.CompositeView
        emptyView: item.LoadingQueryItem

        itemView: item.QueryItem

        itemViewContainer: '.items'

        template: templates.list

        itemViewOptions: (model, index) ->
            model: model
            view: @data.view
            context: @data.context
            index: index
            editable: @editable

        ui:
            title: '.title'
            publicIndicator: '.header > div'

        collectionEvents:
            sync: 'onCollectionSynced'

        initialize: ->
            @data = {}

            @editable = if @options.editable? then @options.editable else false

            @emptyMessage = "You have not yet created any queries nor have had any shared with you. You can create a new query by navigating to the 'Results' page and clicking on the 'Save Query...' button. This will save a query with the current filters and column view."
            if @options.emptyMessage?
                @emptyMessage = @options.emptyMessage

            if not (@data.context = @options.context)
                throw new Error 'context model required'
            if not (@data.view = @options.view)
                throw new Error 'view model required'

            if not (@title = @options.title)
                @title = 'Queries'

            @editQueryRegion = @options.editQueryRegion
            @deleteQueryRegion = @options.deleteQueryRegion

            if @editable
                @on 'itemview:showEditQueryModal', (options) ->
                    @editQueryRegion.currentView.open(options.model)
                @on 'itemview:showDeleteQueryModal', (options) ->
                    @deleteQueryRegion.currentView.open(options.model)

                @editQueryRegion.show new dialog.EditQueryDialog
                    header: 'Edit Query'
                    collection: @collection
                    context: @data.context
                    view: @data.view

        onCollectionSynced: =>
            if @collection.length == 0
                @$el.find('.load-view').html(@emptyMessage)

        onRender: ->
            @ui.title.html(@title)

            if @editable
                @deleteQueryRegion.show new dialog.DeleteQueryDialog
                    collection: @collection
            else
                @ui.publicIndicator.hide()

            # It is possible that the collection was already synced before this
            # view was created and rendered. To handle that case, check to see
            # if the collection has been fetched and if so, handle the empty
            # case here as the onCollectionSynced method will not be called
            # since the sync happened prior to this view being initialized.
            if @collection.synced and @collection.length == 0
                @$el.find('.load-view').html(@emptyMessage)

    { QueryList }
