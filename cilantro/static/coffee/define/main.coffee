define 'cilantro/define/main', ['cilantro/main'], ->

    App = window.App
    if not App
        window.App = App = {}

    App.hub = new PubSub
    App.Models = {}
    App.Collections = {}
    App.Views = {}
    App.Routes = {}

    ###

    What is the best of targeting sub-elements?

    class ObservableView extends Backbone.View
        applyBindings: (bindings) ->
            if !(bindings or (bindings = @bindings)) then return
            sview = Synapse(@)
            for get, set in bindings
                sview.observe(@model, get, set)


    ObservableView::constructor = (options) ->
        @cid = _.uniqueId('view')
        @_configure(options or {})
        @_ensureElement()
        @setLocalElements()
        @applyBindings()
        @delegateEvents()
        @initialize.apply @, arguments

    ###

    class StateView extends Backbone.View
        initialize: ->
            @model.bind 'activate', @activate
            @model.bind 'deactivate', @deactivate
            @model.bind 'show', @show
            @model.bind 'hide', @hide

        # public API convenience methods for other objects to use
        activate: => @el.addClass 'active'
        deactivate: => @el.removeClass 'active'
        show: => @el.show()
        hide: => @el.hide()


    class CollectionView extends Backbone.View
        initialize: ->
            @childViews = {}
            @collection.bind 'add', @add
            @collection.bind 'reset', @reset
            @collection.bind 'remove', @remove
            @collection.bind 'destroy', @destroy

        add: (model) =>
            # the view for this model has already been rendered, simply
            # re-attach it to the DOM
            if model.cid in @childViews
                view = @childViews[model.cid]
                # clear destroy timer from stack
                clearTimeout(view.dtimer)
            # create a new view representing this model
            else
                view = @childViews[model.cid] = (new @viewClass model: model).render()
            @el.append view.el

        # the collection has been reset, so create views for each new model
        reset: (collection, options) =>
            collection.each @add
            if options.initial then @el.animate opacity: 100, 500

        # detach the DOM element. this is intended to be temporary
        remove: (model) =>
            view = @childViews[model.cid]
            view.el.detach()
            # since this should be temporary, we set a timer to destroy the
            # element after some time to prevent memory leaks. note: this has no
            # impact on the underlying model
            view.dtimer = _.delay @destroy, 1000 * 10

        # remove the DOM element and all bound data completely
        destroy: (model) =>
            @childViews[model.cid].el.remove()


    App.Views.State = StateView
    App.Views.Collection = CollectionView
