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
            @info.show new info.ConceptInfo
                model: @model

            @fields.show new field.FieldFormCollection
                context: @context
                collection: @model.fields
                hideSingleFieldInfo: true

            @renderState()

        renderState: ->
            # If this is valid field-level context update the state
            # of the concept form. Only one of the fields need to be
            # valid to update the context
            if @context.isNew(deep: true)
                @renderNew()
            else
                @renderApplied()

            @renderChange()

        renderChange: ->
            @ui.state.hide()
                .removeClass('alert-error alert-warning')

            # Enable the buttons by default, only disable if there is an error
            # or nothing has changed
            @ui.update.prop('disabled', true)
            @ui.apply.prop('disabled', true)

            if not @context.isValid(deep: true)
                className = 'alert-error'
                message = '<strong>Uh oh.</strong> There is a problem applying the filter'

            else if @context.isDirty(deep: true)
                className = 'alert-warning'
                message = '<strong>Heads up!</strong> The filter has been changed, but not applied.'

                # Only provide a revert option if this is an existing filter
                if not @context.isNew(deep: true)
                    message += ' <a class=revert href=#>Revert</a>'

                @ui.apply.prop('disabled', false)
                @ui.update.prop('disabled', false)

            if message?
                @ui.state.show()
                    .html(message)
                    .addClass(className)

        renderApplied: ->
            @ui.apply.hide()
            @ui.update.show()
            @ui.remove.show()

        renderNew: ->
            @ui.apply.show()
            @ui.update.hide()
            @ui.remove.hide()

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
