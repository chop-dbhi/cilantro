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

        align: 'left'

        message: 'You have not yet created any queries nor have had any shared with you.'

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

        modelEvents:
            sync: 'render'

        initialize: ->
            @data = {}
            if not (@data.context = @options.context)
                throw new Error 'context model required'
            if not (@data.view = @options.view)
                throw new Error 'view model required'

        # Custom serialize method to ensure the two nested objects exist for
        # use by the template.
        serializeData: ->
            attrs = @model.toJSON()
            attrs.shared_users ?= []
            attrs.user ?= {}
            return attrs

        # Set the query's context and view json on the session context
        # and view, navigate to the results to view results
        openQuery: =>
            @data.view.save('json', @model.get('view_json'))
            @data.context.save('json', @model.get('context_json'), reset: true)
            c.router.navigate('results', trigger: true)

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
                # Assuming public queries are supported, we don't want to show
                # any non-owner information on the query if it is public.
                if c.isSupported('2.2.0') and @model.get('public')
                    @ui.nonOwner.hide()

                @ui.owner.hide()

    { EmptyQueryItem, QueryItem }
