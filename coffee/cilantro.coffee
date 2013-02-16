define [
    './cilantro/core'
    './cilantro/models'
], (c, models) ->

    c.models = models

    # TODO move this logic into a workflow..
    c.data =
        concepts: new models.ConceptCollection
        fields: new models.FieldCollection
        contexts: new models.ContextCollection
        views: new models.ViewCollection
        
    if c.getOption('autoload') then c.openSession()

    return (@cilantro = c)
