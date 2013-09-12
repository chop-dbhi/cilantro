define [
    '../core'
    './base'
], (c, base) ->


    class ExporterModel extends base.Model


    class ExporterCollection extends base.Collection
        model: ExporterModel

        # Versions greater than or equal to this version are considered to
        # support notification on completion.
        minSerranoVersionProgressFeature: '2.0.16'

        url: ->
            c.session.url('exporter')

        initialize: ->
            super
            c.subscribe c.SESSION_OPENED, => @fetch(reset: true)
            c.subscribe c.SESSION_CLOSED, => @reset()

        notifiesOnComplete: ->
            c.isSupported(@minSerranoVersionProgressFeature)

        parse: (attrs) ->
            if attrs? and attrs._links?
                for key in Object.keys(attrs._links)
                    # Ignore the exporter endpoint itself
                    if key != "self"
                        this.push(new ExporterModel(attrs._links[key]))
                return this.models


    { ExporterModel, ExporterCollection }
