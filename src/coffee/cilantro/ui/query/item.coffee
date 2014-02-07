define [
    'underscore'
    'marionette'
    '../base'
    '../core'
], (_, Marionette, base, c) ->

    class LoadingQueryItem extends base.LoadView
        align: 'left'

    class QueryItem extends Marionette.ItemView
        className: 'row-fluid'

        template: 'query/item'

        ui:
            owner: '.owner'
            nonOwner: '.non-owner'
            shareCount: '.share-count'
            publicIcon: '.public-icon'

        events:
            'click [data-toggle=delete-query-modal]': 'showDeleteQueryModal'
            'click [data-toggle=edit-query-modal]': 'showEditQueryModal'
            'click .shared-query-name': 'openQuery'

        modelEvents:
            sync: 'render'

        initialize: ->
            @data = {}

            @editable = if @options.editable? then @options.editable else false

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

        showEditQueryModal: ->
            @trigger('showEditQueryModal', @model)

        showDeleteQueryModal: ->
            @trigger('showDeleteQueryModal', @model)

        onRender: ->
            if @editable and @model.get('public')
                @ui.publicIcon.removeClass('hidden')

            if @model.get('is_owner')
                @ui.nonOwner.hide()

                emailHTML = _.pluck(@model.get('shared_users'), 'email').join('<br />')
                @ui.shareCount.attr('title', emailHTML)
                # NOTE: The container needs to be set to overcome an issue
                # with tooltip placement in bootstrap < 3.0. This container
                # setting can be removed after we upgrade to bootstrap >= 3.0.
                @ui.shareCount.tooltip({animation: false, html: true, placement: 'right', container: 'body'})
            else
                @ui.owner.hide()

            if not @editable
                @ui.nonOwner.hide()
                @ui.owner.hide()

    { LoadingQueryItem, QueryItem }
