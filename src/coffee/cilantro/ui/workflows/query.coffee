define [
    'underscore'
    'marionette'
    '../core'
    '../base'
    '../concept'
], (_, Marionette, c, base, concept) ->

    ###
    The QueryWorkflow provides an interface for navigating and viewing
    concepts that are deemed 'queryable'. This includes browsing the
    available concepts in the index, viewing details about the
    concept in the workspace as well as adding or modifying filters,
    and viewing the list of filters in the context panel.

    This view requires the following options:
    - concepts: a collection of concepts that are deemed queryable
    - context: the session/active context model
    ###
    class QueryWorkflow extends Marionette.Layout
        className: 'query-workflow'

        template: 'workflows/query'

        regions:
            workspace: '.concept-workspace-region'

        initialize: ->
            @data = {}

            if not (@data.context = @options.context)
                throw new Error 'context model required'

            if not (@data.concepts = @options.concepts)
                throw new Error 'concept collection required'

            # Ensure the necessary panels are toggled
            @on 'router:load', ->
                c.panels.concept.openPanel()
                c.panels.context.openPanel()

            @on 'router:unload', ->
                c.panels.concept.closePanel()

        onRender: ->
            @workspace.show new concept.ConceptWorkspace
                context: @data.context
                concepts: @data.concepts


    { QueryWorkflow }
