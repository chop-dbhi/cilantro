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
                else
                    # Initial publish of being synced since Backbone does
                    # not consider a fetch or reset to be a _sync_ operation
                    # in this version. This has been changed in Backbone
                    # @ commit 1f3f4525
                    mediator.publish 'dataview/synced'

                @session.on 'sync', ->
                    mediator.publish 'dataview/synced'

                mediator.subscribe 'dataview/changed', =>
                    mediator.publish 'dataview/syncing'
                    @session.save()

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
