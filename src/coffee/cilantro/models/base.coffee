define [
    'backbone'
], (Backbone) ->

    class Model extends Backbone.Model
        url: ->
            if @isNew() then super else @links.self

        constructor: (attrs, options) ->
            @links = {}
            super(attrs, options)

        parse: (attrs, options) ->
            if attrs? and attrs._links?
                @links = {}
                for name, link of attrs._links
                    @links[name] = link.href
            return attrs


    class Collection extends Backbone.Collection
        model: Model

        url: ->
            if @isNew() then super else @links.self

        constructor: (attrs, options) ->
            @links = {}
            super(attrs, options)

        parse: (attrs, options) ->
            if attrs? and attrs._links?
                @links = {}
                for name, link of attrs._links
                    @links[name] = link.href
            return attrs


    { Model, Collection }
