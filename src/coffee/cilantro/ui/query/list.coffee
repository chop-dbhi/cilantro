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
        emptyView: item.EmtpyQueryItem

        itemView: item.QueryItem

        itemViewContainer: '.items'

        template: templates.list

        initialize: (options) ->
            @queryModal = options.queryModal

            @on 'itemview:showQueryModal', (options) ->
                @queryModal.currentView.open(options.model)

            @queryModal.show new dialog.QueryDialog
                header: 'Edit Query'
                collection: c.data.queries


    { QueryList }
