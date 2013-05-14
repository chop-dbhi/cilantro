define [
    'underscore'
    'backbone'
], (_, Backbone) ->


    class Router extends Backbone.Router
        options:
            el: 'body'

        initialize: (options) ->
            @el = options.el or @options.el
            @_registered = {}
            @_loaded = []
            @_routes = {}
            @_handlers = {}

        _unloadAll: =>
            @_unload(@_registered[id], false) for id in @_loaded.slice()
            return

        _loadAll: =>
            if not (ids = @_routes[Backbone.history.fragment])? then return
            @_load(@_registered[id]) for id in ids
            return

        _unload: (route, force=true) =>
            if route.route? or force and (idx = @_loaded.indexOf(route.id)) >= 0
                @_loaded.splice(idx, 1)
                if (view = route._view)?
                    view?.$el.hide()
                    view?.unload?()
                    view?.pending?()

        _load: (options) =>

            # If the view has not be loaded before, check if it's a
            # module string and loader asynchronously
            if not options._view?
                if _.isString options.view
                    require [options.view], (klass) =>
                        options._view = new klass options.options
                        @_render(options)
                        @_loaded.push(options.id)

                    return

                options._view = options.view

            @_render(options)
            @_loaded.push(options.id)

        _render: (options) =>
            view = options._view

            if not view._rendered
                options._rendered = true
                if options.el isnt false
                    if options.el?
                        target = Backbone.$(options.el, @el)
                    else
                        target = Backbone.$(@el)
                    target.append(view.el)
                view.render?()

            view.$el.show()
            view.load?()
            view.resolve?()
            return

        _register: (options) ->
            if @_registered[options.id]?
                throw new Error "Route #{ options.id } already registered"

            # Clone since the options options will be augmented
            options = _.clone options

            # Non-routable view.. immediately load and only once
            if not options.route?
                @_load(options)
            else if not @_handlers[options.route]?
                @_routes[options.route] = []
                @_handlers[options.route] = handler = =>
                    @_unloadAll()
                    @_loadAll()
                    return
                @route options.route, handler
            if options.route?
                @_routes[options.route].push options.id
            @_registered[options.id] = options

        register: (routes) ->
            if not _.isArray routes
                routes = [routes]
            for options in routes
                if not options.view then continue
                @_register options
            return

        unregister: (id) ->
            if (options = @_registered[id])?
                @_unload(options)
                delete @_registered[id]
                if (idx = @_routes[options.route]?.indexOf(id)) >= 0
                    @_routes[options.route].splice(idx, 1)
            return


    { Router }
