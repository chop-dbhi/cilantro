define [
    '../core'
    './base'
], (c, base) ->

    class QueryModel extends base.Model


    class QueryCollection extends base.Collection
        model: QueryModel

        url: ->
            c.session.url('shared_queries')

        initialize: ->
            super
            c.subscribe c.SESSION_OPENED, => @fetch(reset: true)
            s.subscribe c.SESSION_CLOSE, => @reset()


    { QueryModel, QueryCollection }
