define [
    'underscore'
    'marionette'
    '../core'
    '../base'
    '../concept'
    '../context'
    'tpl!templates/workflows/query.html'
], (_, Marionette, c, base, concept, context, templates...) ->

    templates = _.object ['query'], templates


    class QueryWorkflow extends Marionette.Layout
        className: 'query-workflow'

        template: templates.query

        initialize: ->
            c.subscribe c.SESSION_OPENED, ->
                if not c.isSupported()
                    $('.serrano-version-warning').show()

        regions:
            concepts: '.concept-panel-region'
            workspace: '.concept-workspace-region'
            context: '.context-panel-region'

        onRender: ->
            @workspace.show new concept.ConceptWorkspace

            # Deferred loading of views..
            @concepts.show new base.LoadView
                message: 'Loading query concepts...'

            @context.show new base.LoadView
                message: 'Loading session context...'

            c.promiser.when 'concepts', =>
                @concepts.show new concept.ConceptPanel
                    collection: c.data.concepts.queryable

                @concepts.currentView.$el.stacked
                    fluid: '.index-region'

            c.promiser.when 'contexts', =>
                @context.show new context.ContextPanel
                    model: c.data.contexts.getSession()

                @context.currentView.$el.stacked
                    fluid: '.tree-region'


    { QueryWorkflow }
