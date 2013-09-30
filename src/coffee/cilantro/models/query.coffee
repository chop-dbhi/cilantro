define [
    '../core'
    './base'
], (c, base) ->

    class QueryModel extends base.Model
        parse: (attrs) ->
            super

            if attrs? and not attrs.shared_users?
                attrs.shared_users = []

            return attrs

    class QueryCollection extends base.SessionCollection
        model: QueryModel

        url: ->
            c.session.url('queries')

        initialize: ->
            super
            c.on c.SESSION_OPENED, => @fetch(reset: true)
            c.on c.SESSION_CLOSE, => @reset()


    class SharedQueryCollection extends QueryCollection
        url: ->
            c.session.url('shared_queries')

        initialize: ->
            super

            @on 'reset', ->
                c.promiser.resolve('shared_queries')


    { QueryModel, QueryCollection, SharedQueryCollection }
