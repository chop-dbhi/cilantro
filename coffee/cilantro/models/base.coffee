define [
    '../core'
], (c) ->

    class Model extends c.Backbone.Model
        url: ->
            if @isNew() then super else @urls.self

        constructor: (attrs, options) ->
            @urls = {}
            super(attrs, options)

        parse: (attrs, options) ->
            if attrs? and attrs._links?
                for name, link of attrs._links
                    @urls[name] = link.href
                delete attrs._links
            return attrs


    class Collection extends c.Backbone.Collection
        model: Model

        url: ->
            if @isNew() then super else @urls.self

        constructor: (attrs, options) ->
            @urls = {}
            super(attrs, options)

        parse: (attrs, options) ->
            if attrs? and attrs._links?
                for name, link of attrs._links
                    @urls[name] = link.href
                delete attrs._links
            return attrs


    { Model, Collection }
