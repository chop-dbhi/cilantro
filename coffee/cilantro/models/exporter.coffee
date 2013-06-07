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
            @version = [0, 0, 0]

        parse: (attrs) ->
            if attrs? and attrs._links?
                if attrs.version?
                    @version = attrs.version
                
                for key in Object.keys(attrs._links)
                    # Ignore the exporter endpoint itself
                    if key != "self"
                        this.push(new ExporterModel(attrs._links[key]))
                return this.models

    { ExporterModel, ExporterCollection }
