define [
    'underscore'
    'marionette'
    '../core'
    'tpl!templates/context/item.html'
], (_, Marionette, c, templates...) ->

    templates = _.object ['item'], templates

    # Returns a flat list of values for `key` that is built by recursing
    # over the `attrs.children` if present.
    flattenAttr = (attrs, key, items=[]) ->
        if not attrs? then return items
        if attrs[key]?
            items.push(attrs[key])
        if attrs.children?
            for child in attrs.children
                flattenAttr(child, key, items)
        return items


    class ContextItem extends Marionette.ItemView
        className: 'context-item'

        template: templates.item

        events:
            'click .language': 'clickShow'
            'click .actions .remove': 'clickRemove'
            'click .actions .state': 'clickState'
            'change .actions .state input': 'clickState'
            # Prevent the click event from input to bubble up to parent button
            'click .actions .state input': 'stopPropagation'

        ui:
            loader: '.actions .icon-spinner'
            actions: '.actions button'
            state: '.actions .state'
            check: '.actions .state input'
            language: '.language'

        modelEvents:
            request: 'showLoadView'
            sync: 'hideLoadView'
            error: 'hideLoadView'
            change: 'renderLanguage'
            'change:enabled': 'renderState'

        stopPropagation: (event) ->
            event.stopPropagation()

        # Navigate to query page when a concept is triggered
        clickShow: (event) ->
            c.router.navigate('query', trigger: true)
            c.trigger(c.CONCEPT_FOCUS, @model.get('concept'))

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
            text = flattenAttr(@model.toJSON(), 'language').join(', ')
            @ui.language.html(text)

        showLoadView: ->
            @ui.loader.show()
            @ui.actions.hide()

        hideLoadView: ->
            @ui.loader.hide()
            @ui.actions.show()

        onRender: ->
            @ui.loader.hide()
            @renderLanguage()
            @renderState()


    { ContextItem }
