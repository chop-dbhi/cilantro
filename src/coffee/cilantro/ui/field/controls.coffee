define [
    'underscore'
    'marionette'
    '../../logger'
    '../../core'
    '../base'
    '../controls'
], (_, Marionette, logger, c, base, controls) ->


    insertAt = (parent, index, element) ->
        children = parent.children()
        lastIndex = children.size()

        if (index < 0)
            index = Math.max(0, lastIndex + 1 + index)

        parent.append(element)

        if index < lastIndex
            children.eq(index).before(children.last())

        return parent


    class FieldControlError extends base.ErrorView
        message: 'Error rendering field control'


    class LoadingFieldControls extends base.LoadView
        message: 'Loading and rendering field controls...'


    # View of a collection of field controls
    class FieldControls extends Marionette.View
        emptyView: LoadingFieldControls

        errorView: FieldControlError

        render: ->
            @collection.each (model, index) =>
                @renderItem(model, index)
            return @el

        # Renders an item.
        renderItem: (model, index) ->
            options = _.extend {},
                model: model.get('model')
                context: model.get('context')
                index: index
            , model.get('options')

            controlId = model.get('control')

            # Get the registered control
            controlView = controls.get(controlId)

            if _.isFunction(controlView)
                @createView(controlView, options)
            else
                # If control view is not defined, fallback to using the
                # control id as the module path
                require [controlView or controlId], (controlView) =>
                    @createView(controlView, options)
                , (err) =>
                    @showErrorView()
                    logger.debug(err)

        createView: (viewClass, options) =>
            try
                view = new viewClass(options)
                view.render()
                insertAt(@$el, options.index, view.el)
            catch err
                @showErrorView(options.model)
                if c.config.get('debug') then throw err

        showErrorView: ->
            view = new @errorView()
            view.render()
            @$el.html(view.el)


    { FieldControls }
