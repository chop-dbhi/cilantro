define [
    'underscore'
    'marionette'
    '../base'
    'tpl!templates/query/item.html'
], (_, Marionette, base, templates...) ->

    templates = _.object ['item'], templates

    class EmptyQueryItem extends base.EmptyView
        icon: false

        message: 'You have not yet created any queries or have had any shared with you'

    class QueryItem extends Marionette.ItemView
        template: templates.item

    { EmptyQueryItem, QueryItem }
