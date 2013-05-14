define [
    '../../core'
    '../field'
    '../charts'
    './info'
    'tpl!templates/views/concept-form.html'
], (c, field, charts, info, templates...) ->

    templates = c._.object ['form'], templates


    class ConceptForm extends c.Marionette.Layout
        className: 'concept-form'

        template: templates.form

        constructor: ->
            super
            session = c.data.contexts.getSession()
            @context = session.root.fetch
                concept: @model.id
            ,
                create: 'branch'

        events:
            'click .concept-actions [data-toggle=add]': 'save'
            'click .concept-actions [data-toggle=update]': 'save'
            'click .concept-actions [data-toggle=remove]': 'clear'

        ui:
            actions: '.concept-actions'
            add: '.concept-actions [data-toggle=add]'
            remove: '.concept-actions [data-toggle=remove]'
            update: '.concept-actions [data-toggle=update]'

        regions:
            info: '.concept-info'
            fields: '.concept-fields'

        onRender: ->
            @info.show new info.ConceptInfo
                model: @model

            @fields.show new field.FieldFormCollection
                collection: @model.fields
                context: @context
                hideSingleFieldInfo: true

            @setState()

        setState: ->
            # If this is valid field-level context update the state
            # of the concept form. Only one of the fields need to be
            # valid to update the context
            if @context?.isValid()
                @setUpdateState()
            else
                @setNewState()

        setUpdateState: ->
            @ui.add.hide()
            @ui.update.show()
            @ui.remove.show()

        setNewState: ->
            @ui.add.show()
            @ui.update.hide()
            @ui.remove.hide()

        # Saves the current state of the context which enables it to be
        # synced with the server.
        save: ->
            if @context?
                @context.save()
                c.publish c.CONTEXT_SAVE
            @setUpdateState()

        # Clears the local context of conditions
        clear: ->
            @context?.clear()
            @setNewState()


    { ConceptForm }
