define ['jquery', 'underscore'], ($, _) ->

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
            return

        # Initializes (or resets) the deferred object
        pending: ->
            (@_deferred = $.Deferred()).once = {}
            return @

        # Used for deferring method/function calls. If `once` is true and a name
        # is supplied, the named function will only be deferred once to prevent
        # multiple redundant calls.
        defer: (name, func, once=false, args) ->
            if not @_deferred? then @pending()
            if _.isString name
                # Shift arguments, assume `name` is a function name on
                # this object
                if _.isBoolean func
                    once = func
                    func = @[name]
                # If this is a one-time deferral, ensure it has not
                # already been queued
                if once
                    if @_deferred[name] then return @
                    @_deferred.once[name] = true
            else
                func = name
            @_deferred.done -> func args...
            return @

        # Resolve the deferred object
        resolve: (context=@)->
            if @_deferred then @_deferred.resolveWith context
            return @

        reject: (context=@) ->
            if @_deferred then @_deferred.rejectWith context
            return @

        # Implements the promise interface which can be used with the
        # `$.when` function
        promise: ->
            if not @_deferred? then @pending()
            return @_deferred.promise arguments...

        when: (func) ->
            $.when(@).done(func)

        state: ->
            @_deferred?.state()

    Deferrable.resolveWith = Deferrable.resolve
    Deferrable.rejectWith = Deferrable.reject

    { Deferrable }
