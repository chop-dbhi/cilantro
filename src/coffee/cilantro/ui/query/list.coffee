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
            error: 'onCollectionError'
            request: 'onCollectionRequest'
            sync: 'onCollectionSync'
            destroy: 'onCollectionDestroy'

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

        _refreshList: =>
            @$('.error-message').hide()
            @$('.loading-indicator').hide()
            @checkForEmptyCollection()

        # When a model is destroyed, it does not call sync on the collection
        # but it does trigger a destroy event on the collection. That is the
        # reason for this separate handler. When a query is deleted, we will
        # get the request event and then destroy event, there will never be
        # a sync event in the case a user deleting a query.
        onCollectionDestroy: =>
            @_refreshList()

        onCollectionError: =>
            @$('.empty-message').hide()
            @$('.error-message').show()
            @$('.loading-indicator').hide()

        onCollectionRequest: =>
            @$('.empty-message').hide()
            @$('.error-message').hide()
            @$('.loading-indicator').show()

        onCollectionSync: =>
            @_refreshList()

        checkForEmptyCollection: ->
            if @collection.length == 0
                @$('.empty-message').show()
            else
                @$('.empty-message').hide()

        onRender: ->
            @ui.title.html(@title)

            if @editable
                @deleteQueryRegion.show new dialog.DeleteQueryDialog
                    collection: @collection
            else
                @ui.publicIndicator.hide()

            @$('.empty-message').html(@emptyMessage)
            @checkForEmptyCollection()

    { QueryList }
