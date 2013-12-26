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

            @requestPending = false

        onCollectionError: =>
            @requestPending = false

            @$('.empty-message').hide()
            @$('.error-message').show()
            @$('.loading-indicator').hide()

        onCollectionRequest: =>
            @requestPending = true

            @$('.empty-message').hide()
            @$('.error-message').hide()
            @$('.loading-indicator').show()

        onCollectionSync: =>
            @requestPending = false

            @$('.error-message').hide()
            @$('.loading-indicator').hide()

            if @collection.length == 0
                @$('.empty-message').show()

        onRender: ->
            @ui.title.html(@title)
            @$('.empty-message').html(@emptyMessage)

            if @editable
                @deleteQueryRegion.show new dialog.DeleteQueryDialog
                    collection: @collection
            else
                @ui.publicIndicator.hide()

            # If there is no request pending then the collection should be
            # populated already so check for an empty collection and render
            # the empty message if needed.
            if not @requestPending
                @$('.loading-indicator').hide()
                if @collection.length == 0
                    @$('.empty-message').show()

    { QueryList }
