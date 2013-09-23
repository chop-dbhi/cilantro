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
            shareCount: '.share-count'

        events:
            'click .delete-query': 'deleteQuery'
            'click [data-toggle=query-modal]': 'showQueryModal'

        initialize: ->
            @model.on 'sync', =>
                @render()

        showQueryModal: ->
            @trigger('showQueryModal', @model)

        deleteQuery: ->
            @model.destroy({wait: true})

        onRender: ->
            if @model.get('is_owner')
                @ui.nonOwner.hide()

                emailHTML = _.pluck(@model.get('shared_users'), 'email').join('<br />')
                @ui.shareCount.attr('title', emailHTML)
                @ui.shareCount.tooltip({animation: false, html: true, placement: 'right'})
            else
                @ui.owner.hide()

    { EmptyQueryItem, QueryItem }
