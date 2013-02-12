define ['backbone', 'underscore'], (Backbone, _) ->

    class ConceptModel extends Backbone.Model


    class ConceptCollection extends Backbone.Collection
        model: ConceptModel

        initialize: ->
            super
            @on 'reset', @resolve

        search: (query, process) ->
            Backbone.ajax
                url: _.result @, 'url'
                data: q: query
                success: (resp) ->
                    process(resp)


    { ConceptModel, ConceptCollection }
