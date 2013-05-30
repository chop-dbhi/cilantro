define [
    '../core'
    'tpl!templates/views/context-item.html'
], (c, templates...) ->

    templates = c._.object ['item'], templates

    flattenLanguage = (attrs, items=[]) ->
        if attrs.children?
            for child in attrs.children
                flattenLanguage(child, items)
        else if attrs.language?
            items.push(attrs.language)
        return items


    class ContextItem extends c.Marionette.ItemView
        className: 'context-item'

        template: templates.item

        events:
            'click .language': 'clickShow'
            'click .actions .state': 'clickState'
            'click .actions .remove': 'clickRemove'

        ui:
            loader: '.actions .loader'
            actions: '.actions button'
            state: '.actions .state'
            language: '.language'

        modelEvents:
            'change': 'renderLanguage'
            'change:enabled': 'toggleState'
            'request': 'showLoading'
            'sync': 'doneLoading'
            'error': 'doneLoading'

        serializeData: ->
            language: flattenLanguage(@model.toJSON()).join(', ')

        clickShow: (event) ->
            c.router.navigate('query', trigger: true)
            c.publish c.CONCEPT_FOCUS, @model.get('concept')

        clickRemove: (event) ->
            @model.local.clear()
            @$el.fadeOut
                duration: 400
                easing: 'easeOutExpo'

            c.publish c.CONTEXT_SAVE

        clickState: (event) ->
            local = @model.local
            if local.isEnabled()
                local.disable()
            else
                local.enable()
            c.publish c.CONTEXT_SAVE

        disable: ->
            @$el.addClass('disabled')
            @ui.state
                .attr('title', 'Enable')
                .find('i')
                    .addClass('icon-circle-blank')
                    .removeClass('icon-circle')

        enable: ->
            @$el.removeClass('disabled')
            @ui.state
                .attr('title', 'Disable')
                .find('i')
                    .addClass('icon-circle')
                    .removeClass('icon-circle-blank')

        toggleState: (model, value, options) ->
            if @model.local.isEnabled()
                @enable()
            else
                @disable()

        renderLanguage: (model, options) ->
            text = flattenLanguage(model.toJSON()).join(', ')
            @ui.language.html(text)

        showLoading: ->
            @ui.loader.show()
            @ui.actions.hide()

        doneLoading: ->
            @ui.loader.hide()
            @ui.actions.show()

        onRender: ->
            @ui.loader.hide()
            @toggleState()


    { ContextItem }
