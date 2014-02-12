define [
    'underscore'
    'marionette'
    '../../core'
    '../field'
    '../charts'
    './info'
], (_, Marionette, c, field, charts, info) ->

    class ConceptForm extends Marionette.Layout
        className: 'concept-form'

        template: 'concept/form'

        infoView: info.ConceptInfo

        fieldCollectionView: field.FieldFormCollection

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
            apply: 'renderApplied'
            remove: 'renderNew'
            clear: 'renderNew'
            change: 'renderChange'
            invalid: 'renderInvalid'

        constructor: (options={}) ->
            @data = {}
            if not (@data.context = options.context)
                throw new Error 'context model required'

            if not options.model
                throw new Error 'concept model required'

            # Define or get the local context node
            @context = @data.context.manager.define
                concept: options.model.id
            , type: 'branch'

            super(options)

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

            options = _.extend {}, @options,
                context: @context
                collection: @model.fields

            @fields.show(new @fieldCollectionView(options))

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
            if @context.isNew()
                @renderNew()
            else
                @renderApplied()

        # Renders an error message if the filter is deemed invalid
        renderInvalid: (model, error, options) ->
            className = 'alert-error'
            message = "<strong>Uh oh.</strong> Cannot apply filter: #{ error }"

            # Add the ability to revert the context
            if not @context.isNew()
                message += ' <a class=revert href=#>Revert</a>'

            @_renderFooter(message, className, false)

        renderApplied: ->
            @ui.apply.hide()
            @ui.update.show()
            @ui.remove.show()

            if (enabled = @context.isDirty())
                className = 'alert-warning'
                message = '<strong>Heads up!</strong> The filter has been changed. <a class=revert href=#>Revert</a>'

            # Strictly check if this context is valid which requires at least
            # one condition to be present
            enabled = enabled and @context.isValid()
            @_renderFooter(message, className, enabled)

        renderNew: ->
            @ui.apply.show()
            @ui.update.hide()
            @ui.remove.hide()
            # Strictly check if this context is valid which requires at least
            # one condition to be present
            @_renderFooter(null, null, @context.isValid())

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
