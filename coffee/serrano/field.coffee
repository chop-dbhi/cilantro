define ['backbone', 'underscore'], (Backbone, _) ->

    class FieldModel extends Backbone.Model


    class FieldCollection extends Backbone.Collection
        model: FieldModel

        initialize: ->
            super
            @on 'reset', @resolve
		
        search: (query, handler) ->
            Backbone.ajax
                url: _.result @, 'url'
                data: q: query
                success: (resp) -> handler(resp)


    { FieldModel, FieldCollection }
