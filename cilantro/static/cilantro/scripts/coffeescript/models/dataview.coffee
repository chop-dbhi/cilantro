define [
    'environ'
    'mediator'
    'underscore'
    'serrano'
], (environ, mediator, _, Serrano) ->

    class DataViews extends Serrano.DataViews
        url: environ.absolutePath '/api/views/'

        initialize: ->
            super
            @on 'reset', ->
                # Special treatment for the session
                if not (@session = @getSession())
                    @session = @create session: true

                @session.on 'sync', ->
                    mediator.publish 'dataview/change'

                # Resolve all pending handlers
                @resolve()

            @fetch()


    class DataViewHistory extends Serrano.DataViews
        url: environ.absolutePath '/api/views/history/'

         initialize: ->
            super
            @on 'reset', @resolve
            @fetch()


    App.DataView = new DataViews
    App.DataViewHistory = new DataViewHistory
