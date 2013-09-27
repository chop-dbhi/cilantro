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

        initialize: ->
            @queryModalRegion = @options.queryModalRegion

            @on 'itemview:showQueryModal', (options) ->
                @queryModalRegion.currentView.open(options.model)

            @queryModalRegion.show new dialog.QueryDialog
                header: 'Edit Query'
                collection: @collection

    { QueryList }
