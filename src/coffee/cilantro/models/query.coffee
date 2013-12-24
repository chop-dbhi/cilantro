define [
    './base'
], (base) ->

    class QueryModel extends base.Model
        parse: (attrs) ->
            super

            if attrs? and not attrs.shared_users?
                attrs.shared_users = []

            return attrs

    class QueryCollection extends base.Collection
        model: QueryModel

        initialize: ->
            @synced = false
            @listenTo @, 'sync', -> @synced = true

    { QueryModel, QueryCollection }
