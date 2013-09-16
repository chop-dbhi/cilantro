define [
    'backbone'
], (Backbone) ->

    # Base model for Cilantro. Data for models commonly contain a
    # `_links` attribute which is parsed to be made accessible for
    # consumers.
    class Model extends Backbone.Model
        url: ->
            if @isNew() then super else @links.self

        constructor: (attrs, options) ->
            @links = {}
            super(attrs, options)
            @on 'change:_links', (model, attrs, options) ->
                @_parseLinks(attrs)

        _parseLinks: (attrs) ->
            links = {}
            for name, link of attrs
                links[name] = link.href
            @links = links

        parse: (attrs) ->
            if attrs?._links?
                @_parseLinks(attrs._links)
            return attrs

    # Base collection for Cilantro. Data for collections commonly contain a
    # `_links` attribute which is parsed to be made accessible for
    # consumers.
    class Collection extends Backbone.Collection
        model: Model

        url: -> @links.self

        constructor: (attrs, options) ->
            @links = {}
            super(attrs, options)

        _parseLinks: (attrs) ->
            links = {}
            for name, link of attrs
                links[name] = link.href
            @links = links

        parse: (attrs) ->
            if attrs?._links?
                @_parseLinks(attrs._links)
            return attrs

    class SynclessModel extends Model
        sync: ->

    class SynclessCollection extends Collection
        sync: ->

    # Base collection class that is session-aware. A session is always
    # created on initialization which enables immediately binding to the
    # session object, as well transparency when switching between session
    # objects. This is used for Context, View and Query collections.
    class SessionCollection extends Collection
        initialize: ->
            @add(session: true)
            @session = @get('session')

        _resetSession: ->
            @session.clear(silent: true)
            @session.set('session', true, silent: true)

        reset: (models, options={}) ->
            for model in @models
                if model is @session
                    @_resetSession()
                else
                    @_removeReference(model)
            options.previousModels = @models
            @_reset()
            @add(@session, _.extend(silent: true, options))
            if (model = _.findWhere(models, session: true))
                @session.set(model, options)
            @add(models, _.extend(silent: true, merge: true, options))
            if not options.silent then @trigger('reset', @, options)
            return @

        # Extend `get` to lookup by session if passed. The session model
        # may change over time which is independent of the model id.
        # Furthermore, it guarantees views will have something to bind to
        # prior to it being fetched from the server.
        get: (attrs) ->
            session = false
            if attrs instanceof Backbone.Model
                session = attrs.get('session')
            if attrs is 'session' or (typeof attrs is 'object' and attrs.session)
                session = true
            if session
                @findWhere(session: true)
            else
                super(attrs)

        getSession: ->
            @session

    { Model, Collection, SynclessModel, SynclessCollection, SessionCollection }
