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
        emptyView: item.EmptyQueryItem

        itemView: item.QueryItem

        itemViewContainer: '.items'

        template: templates.list

        itemViewOptions: (model, index) ->
            model: model
            view: @data.view
            context: @data.context
            index: index

        ui:
            title: '.title'

        initialize: ->
            @data = {}
            if not (@data.context = @options.context)
                throw new Error 'context model required'
            if not (@data.view = @options.view)
                throw new Error 'view model required'

            if not (@title = @options.title)
                @title = 'Queries'

            @queryModalRegion = @options.queryModalRegion

            @on 'itemview:showQueryModal', (options) ->
                @queryModalRegion.currentView.open(options.model)

            @queryModalRegion.show new dialog.QueryDialog
                header: 'Edit Query'
                collection: @collection
                context: @data.context
                view: @data.view

        onRender: ->
            @ui.title.html(@title)

    { QueryList }
