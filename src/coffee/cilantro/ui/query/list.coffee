define [
    'underscore'
    'marionette'
    './item'
    'tpl!templates/query/list.html'
], (_, Marionette, query, templates...) ->

    templates = _.object ['list'], templates

    class QueryList extends Marionette.CompositeView
        emptyView: query.EmtpyQueryItem

        itemView: query.QueryItem

        itemViewContainer: '.items-list'

        template: templates.list

    { QueryList }
