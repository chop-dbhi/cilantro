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
            check: '.actions .state input'
            language: '.language'

        modelEvents:
            'change': 'renderLanguage'
            'change:enabled': 'toggleState'
            'request': 'showLoading'
            'sync': 'doneLoading'
            'error': 'doneLoading'

        clickShow: (event) ->
            c.router.navigate('query', trigger: true)
            c.publish(c.CONCEPT_FOCUS, @model.get('concept'))

        clickRemove: (event) ->
            @model.destroy()
            @$el.fadeOut
                duration: 400
                easing: 'easeOutExpo'
            c.publish(c.CONTEXT_SAVE, null, 'stable')

        clickState: (event) ->
            if @model.isEnabled()
                @model.disable()
            else
                @model.enable()
            c.publish(c.CONTEXT_SAVE, null, 'stable')

        disable: ->
            @$el.addClass('disabled')
            @ui.state.attr('title', 'Enable')
            @ui.check.prop('checked', false)

        enable: ->
            @$el.removeClass('disabled')
            @ui.state.attr('title', 'Disable')
            @ui.check.prop('checked', true)

        toggleState: (model, value, options) ->
            if @model.isEnabled()
                @enable()
            else
                @disable()

        renderLanguage: ->
            text = flattenLanguage(@model.toJSON()).join(', ')
            @$el.toggle(!!text)
            @ui.language.html(text)

        showLoading: ->
            @ui.loader.show()
            @ui.actions.hide()

        doneLoading: ->
            @ui.loader.hide()
            @ui.actions.show()

        onRender: ->
            @ui.loader.hide()
            @renderLanguage()
            @toggleState()


    { ContextItem }
