define [
        'cilantro/define/criteriamanager'
        'cilantro/define/conceptmanager'
    ],

    (CriteriaManager, ConceptManager) ->

        class ConceptInterfaceView extends Backbone.View
            el: '#plugin-panel'

            initialize: ->
                App.hub.subscribe 'concept/active', @activate

            activate: (model) =>

                condition = CriteriaManager.retrieveCriteriaDS(model.id)

                if ConceptManager.isConceptLoaded(model.id)
                    ConceptManager.show id: model.id, condition
                else
                    model.fetch
                        beforeSend: => @el.block()
                        complete: => @el.unblock()
                        success: ->
                            ConceptManager.show(model.get('viewset'), condition)

        return {
            ConceptInterfaceView: ConceptInterfaceView
        }
