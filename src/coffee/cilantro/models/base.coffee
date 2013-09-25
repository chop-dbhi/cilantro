define [
    'backbone'
], (Backbone) ->

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


    { Model, Collection, SynclessModel, SynclessCollection }
