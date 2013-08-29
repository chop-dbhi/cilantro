define [
    '../core'
    './base'
], (c, base) ->

    class QueryModel extends base.Model


    class QueryCollection extends base.Collection
        model: QueryModel

        url: ->
            c.session.url('queries')

        initialize: ->
            super
            c.subscribe c.SESSION_OPENED, => @fetch(reset: true)
            c.subscribe c.SESSION_CLOSE, => @reset()


    class SharedQueryCollection extends QueryCollection
        url: ->
            c.session.url('shared_queries')


    { QueryModel, QueryCollection, SharedQueryCollection }
