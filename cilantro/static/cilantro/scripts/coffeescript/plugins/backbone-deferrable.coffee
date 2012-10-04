# Integrates deferred behavior into Backbone classes
define [
    'jquery'
    'underscore'
    'backbone'
], ($, _, Backbone) ->

    Deferrable =
        deferred: {}

        initialize: ->
            @pending()

            # Takes an object of method names and flags for implicitly
            # wrapping class methods in a deferred execution
            for method, once of @deferred
                do (method, once) =>
                    func = @[method]
                    @[method] = =>
                        @defer method, func, once, arguments

        # Initializes the deferred object if one is already set. If `clear`
        # is true, this will force the deferred object to be cleared.
        pending: (clear=false) ->
            if @_deferred? and @state() is 'pending' and not clear then return @
            (@_deferred = $.Deferred()).once = {}
            return @

        # Used for deferring method/function calls. If `once` is true and a name
        # is supplied, the named function will only be deferred once to prevent
        # multiple redundant calls.
        defer: (name, func, once=true, args) ->
            @pending()
            if _.isString name
                # Shift arguments, assume `name` is a function name on
                # this object
                if not _.isFunction func
                    once = func
                    func = @[name]
                # If this is a one-time deferral, ensure it has not
                # already been queued
                if once
                    if @_deferred.once[name] then return @
                    @_deferred.once[name] = true
            else
                func = name
            @_deferred.done -> func args...
            return @

        # Resolve the deferred object
        resolve: (context=@)->
            @pending()
            if @_deferred then @_deferred.resolveWith context
            return @

        reject: (context=@) ->
            @pending()
            @_deferred.rejectWith context
            return @

        # Implements the promise interface which can be used with the
        # `$.when` function
        promise: ->
            @pending()
            return @_deferred.promise arguments...

        when: (func) ->
            @pending()
            $.when(@).done(func)
            return @

        state: ->
            @_deferred?.state()


    Deferrable.resolveWith = Deferrable.resolve
    Deferrable.rejectWith = Deferrable.reject

    # Extend Backbone classes
    _.extend Backbone.View::, Deferrable
    _.extend Backbone.Model::, Deferrable
    _.extend Backbone.Collection::, Deferrable
    _.extend Backbone.Router::, Deferrable

    return
