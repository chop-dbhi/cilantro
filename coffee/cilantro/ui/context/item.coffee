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


    class ContextNode extends c.Marionette.ItemView
        className: 'context-node'

        template: templates.item

        events:
            'click .actions .destroy': 'clickDestroy'
            'click .actions .state': 'clickState'

        ui:
            state: '.actions .state'

        initialize: ->
            @listenTo(@model, 'destroy', @destroyNode, @)
            @listenTo(@model, 'change:enabled', @toggleState, @)

        serializeData: ->
            language: flattenLanguage(@model.toJSON()).join(', ')

        clickDestroy: (event) ->
            @model.destroy()

        clickState: (event) ->
            enabled = @model.get('enabled') isnt false
            @model.set('enabled', !enabled)

        destroyNode: (event) ->
            @$el.fadeOut
                duration: 400
                easing: 'easeOutExpo'
                complete: => @close()

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

        toggleState: (event) ->
            enabled = @model.get('enabled') isnt false
            if enabled then @enable() else @disable()

        onRender: ->
            @toggleState()


    { ContextNode }
