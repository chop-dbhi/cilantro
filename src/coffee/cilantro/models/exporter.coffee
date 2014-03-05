define [
    '../core'
    './base'
], (c, base) ->


    class ExporterModel extends base.Model


    class ExporterCollection extends base.Collection
        model: ExporterModel

        parse: (attrs) ->
            if attrs? and attrs._links?
                # Ignore the exporter endpoint itself
                return (value for key, value of attrs._links when key isnt "self")


    { ExporterModel, ExporterCollection }
