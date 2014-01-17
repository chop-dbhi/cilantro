define [
    'backbone'
], (Backbone) ->


    class SetModel extends Backbone.Model
        initialize: (attrs={}) ->
            # Sub-collection of objects contained in this set
            @objects = new Backbone.Collection(attrs.objects)

        parse: (resp={}) ->
            @objects.reset(resp.objects)
            return resp

        # Overridden to serialize objects from `objects` sub-collection
        toJSON: ->
            attrs = super
            attrs.objects = @objects.toJSON()
            return attrs


    class SetCollection extends Backbone.Collection
        model: SetModel


    class SetTypesCollection extends Backbone.Collection
        initialize: (models=[]) ->
            @collections = {}

        parse: (resp=[]) ->
            for attrs in resp
                collection = new SetCollection
                collection.label = attrs.label
                collection.url = attrs._links.self
                collection.fetch()
                @collections[attrs.label] = collection
            return resp


    { SetModel, SetCollection, SetTypesCollection }
