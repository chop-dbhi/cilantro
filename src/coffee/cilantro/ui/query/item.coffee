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
        className: 'row-fluid'

        template: templates.item

        ui:
            owner: '.owner'
            nonOwner: '.non-owner'

        events:
            'click .delete-query': 'deleteQuery'

        deleteQuery: ->
            @model.destroy({wait: true})

        onRender: ->
            if @model.get('is_owner')
                @ui.nonOwner.hide()
            else
                @ui.owner.hide()

    { EmptyQueryItem, QueryItem }
