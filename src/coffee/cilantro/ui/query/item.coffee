define [
    'underscore'
    'marionette'
    '../base'
    '../core'
    'tpl!templates/query/item.html'
], (_, Marionette, base, c, templates...) ->

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
            'click .shared-query-name': 'openQuery'

        initialize: ->
            @model.on 'sync', =>
                @render()

        openQuery: =>
            (context = c.data.contexts.getSession()).set('json', @model.get('context_json'), reset: true)
            (view = c.data.views.getSession()).set('json', @model.get('view_json'))

            d1 = context.save(null, silent: true)
            d2 = view.save(null, silent: true)

            $.when(d1, d2).done ->
                c.publish(c.CONTEXT_SYNCED, context, 'success')
                c.publish(c.VIEW_SYNCED, view, 'success')

            c.router.navigate('results/', trigger: true)

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
