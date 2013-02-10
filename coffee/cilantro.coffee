define [
    './cilantro/core'
    './cilantro/models'
    './cilantro/router'
], (c, models, Router) ->

    c.models = models
    
    c.data =
        concepts: new models.ConceptCollection
        fields: new models.FieldCollection
        contexts: new models.ContextCollection
        views: new models.ViewCollection
        
    # c.router = new Router

    return (@cilantro = c)
