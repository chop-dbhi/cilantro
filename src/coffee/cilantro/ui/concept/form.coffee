define [
    '../../core'
    '../field'
    '../charts'
    './info'
    'tpl!templates/concept/form.html'
], (c, field, charts, info, templates...) ->

    templates = c._.object ['form'], templates


    class ConceptForm extends c.Marionette.Layout
        className: 'concept-form'

        template: templates.form

        infoView: info.ConceptInfo

        fieldCollectionView: field.FieldFormCollection

        constructor: (options={}) ->
            if not options.context?
                session = c.data.contexts.getSession()
                options.context = session.manager.define
                    concept: options.model.id
                , type: 'branch'
            @context = options.context
            super(options)

        events:
            'click .footer [data-toggle=apply]': 'applyFilter'
            'click .footer [data-toggle=update]': 'applyFilter'
            'click .footer [data-toggle=remove]': 'removeFilter'
            'click .footer .revert': 'revertFilter'

        ui:
            state: '.footer .state'
            apply: '.footer [data-toggle=apply]'
            update: '.footer [data-toggle=update]'
            remove: '.footer [data-toggle=remove]'

        regions:
            info: '.info-region'
            fields: '.fields-region'

        contextEvents:
            'apply': 'renderApplied'
            'remove': 'renderNew'
            'change': 'renderChange'
            'child:change': 'renderChange'
            'invalid': 'renderInvalid'
            'child:invalid': 'renderInvalid'

        delegateEvents: (events) ->
            super

            # Bind context events relative to this node
            for event, method of @contextEvents
                @listenTo @context, event, @[method], @
            return

        undelegateEvents: ->
            super

            # Unbind context-based events relative to this node
            for event, method of @contextEvents
                @stopListening @context, event, @[method]
            return

        onRender: ->
            @info.show new @infoView
                model: @model

            @fields.show new @fieldCollectionView
                context: @context
                collection: @model.fields
                hideSingleFieldInfo: true

            @renderChange()

        # Changes the state of the footer elements given a message, class
        # name and whether the buttons should be enabled.
        _renderFooter: (message, className, enabled) ->
            @ui.state.removeClass('alert-error', 'alert-warning')

            if message
                @ui.state.show().html(message)
            else
                @ui.state.hide().html('')

            if className
                @ui.state.addClass(className)

            @ui.apply.prop('disabled', not enabled)
            @ui.update.prop('disabled', not enabled)

        renderChange: ->
            if @context.isNew(deep: true)
                @renderNew()
            else
                @renderApplied()

        # Renders an error message if the filter is deemed invalid
        renderInvalid: (model, error, options) ->
            className = 'alert-error'
            message = "<strong>Uh oh.</strong> Cannot apply filter: #{ error }"

            # Add the ability to revert the context
            if not @context.isNew(deep: true)
                message += ' <a class=revert href=#>Revert</a>'

            @_renderFooter(message, className, false)

        renderApplied: ->
            @ui.apply.hide()
            @ui.update.show()
            @ui.remove.show()

            if (enabled = @context.isDirty(deep: true))
                className = 'alert-warning'
                message = '<strong>Heads up!</strong> The filter has been changed. <a class=revert href=#>Revert</a>'
            @_renderFooter(message, className, enabled)

        renderNew: ->
            @ui.apply.show()
            @ui.update.hide()
            @ui.remove.hide()
            @_renderFooter(null, null, true)

        # Saves the current state of the context which enables it to be
        # synced with the server.
        applyFilter: (event) ->
            event?.preventDefault()
            @context.apply()

        # Remove the filter
        removeFilter: (event) ->
            event?.preventDefault()
            @context.remove()

        # Revert the filter
        revertFilter: (event) ->
            event?.preventDefault()
            @context.revert()


    { ConceptForm }
