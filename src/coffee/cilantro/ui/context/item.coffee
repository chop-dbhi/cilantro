define [
    '../core'
    'tpl!templates/context/item.html'
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
            'click .actions .state input': 'stopPropagation'
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
            'change:enabled': 'renderState'
            'request': 'showLoading'
            'sync': 'doneLoading'
            'error': 'doneLoading'

        stopPropagation: (event) ->
            event.stopPropagation()

        # Navigate to query page when a concept is triggered
        clickShow: (event) ->
            c.router.navigate('query', trigger: true)
            c.publish(c.CONCEPT_FOCUS, @model.get('concept'))

        clickRemove: (event) ->
            @model.remove()
            @$el.fadeOut
                duration: 400
                easing: 'easeOutExpo'

        # Toggle the enabled state of the node
        clickState: (event) ->
            @model.toggleEnabled()

        renderEnabled: ->
            @$el.removeClass('disabled')
            @ui.state.attr('title', 'Disable')
            @ui.check.prop('checked', true)

        renderDisabled: ->
            @$el.addClass('disabled')
            @ui.state.attr('title', 'Enable')
            @ui.check.prop('checked', false)

        renderState: (node, value, options) ->
            if @model.isEnabled()
                @renderEnabled()
            else
                @renderDisabled()

        renderLanguage: (node) ->
            text = flattenLanguage(@model.toJSON()).join(', ')
            @ui.language.html(text)

        showLoading: ->
            @ui.loader.show()
            @ui.actions.hide()

        # Ensure the view has not been closed
        doneLoading: ->
            @ui.loader.hide()
            @ui.actions.show()

        onRender: ->
            @ui.loader.hide()
            @renderLanguage()
            @renderState()


    { ContextItem }
