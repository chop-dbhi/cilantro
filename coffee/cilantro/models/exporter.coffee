define [
    '../core'
    './base'
], (c, base) ->


    class ExporterModel extends base.Model


    class ExporterCollection extends base.Collection
        model: ExporterModel

        url: ->
            c.getSessionUrl('exporter')

        initialize: ->
            super
            c.subscribe c.SESSION_OPENED, => @fetch(reset: true)
            c.subscribe c.SESSION_CLOSED, => @reset()

    { ExporterModel, ExporterCollection }
