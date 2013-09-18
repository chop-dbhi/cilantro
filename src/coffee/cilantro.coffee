define [
    './cilantro/core'
    './cilantro/models'
    './cilantro/structs'
    './cilantro/ui'
], (c, models, structs, ui) ->

    c.models = models
    c.structs = structs
    c.ui = ui

    c.data =
        concepts: new models.ConceptCollection
        fields: new models.FieldCollection
        contexts: new models.ContextCollection
        views: new models.ViewCollection
        results: new models.Results
        exporters: new models.ExporterCollection

    if c.isSupported('2.1.0')
        shared_queries: new models.SharedQueryCollection
        queries: new models.QueryCollection

    if c.config.get('autoload')
        c.session.open(c.config.get('url'), c.config.get('credentials'))

    return (@cilantro = c)
