define [
    '../core'
    'tpl!templates/views/context-item.html'
], (c, templates...) ->

    templates = c._.object ['item'], templates

    class ContextNode extends c.Marionette.ItemView
        className: 'context-node'

        template: templates.item

        events:
            'click .actions .destroy': 'destroyNode'
            'click .actions .state': 'toggleState'

        ui:
            state: '.actions .state'

        serializeData: ->
            language: @model.get('language')

        destroyNode: (event) ->
            if @model? then @model.destroy()
            @$el.fadeOut
                duration: 400
                easing: 'easeOutExpo'
                complete: => @close()

        disable: (trigger=true) ->
            @$el.addClass('disabled')
            @ui.state
                .attr('title', 'Enable')
                .find('i')
                    .addClass('icon-circle-blank')
                    .removeClass('icon-circle')

            if trigger then @model.set enabled: false

        enable: (trigger=true) ->
            @$el.removeClass('disabled')
            @ui.state
                .attr('title', 'Disable')
                .find('i')
                    .addClass('icon-circle')
                    .removeClass('icon-circle-blank')

            if trigger then @model.set enabled: true

        toggleState: (event) ->
            disabled = @model.get('enabled') is false
            if disabled then @enable(event) else @disable(event)

        onRender: ->
            disabled = @model.get('enabled') is false
            # Initial state corresponds to the flag
            if disabled then @disable(false) else @enable(false)


    { ContextNode }
