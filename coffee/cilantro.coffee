define [
    './cilantro/core'
    './cilantro/changelog'
    './cilantro/models'
    './cilantro/structs'
], (c, changelog, models, structs) ->

    c.changelog = changelog
    c.models = models
    c.structs = structs

    c.data =
        concepts: new models.ConceptCollection
        fields: new models.FieldCollection
        contexts: new models.ContextCollection
        views: new models.ViewCollection
        results: new models.Results
        exporters: new models.ExporterCollection

    if c.getOption('autoload')
        c.openSession()

    return (@cilantro = c)
