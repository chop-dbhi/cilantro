/*
 * The criterion objects provide the necessary data to render the interface
 * for interaction by the user. Thus, by definition, everything roughly
 * depends on which  criterion is currently active
 *
 * On Load:
 * - request all criterion objects, cache in local datastore
 *
 * User Interactions:
 * - on click, trigger an event that the criterion has changed
 *
 * All events are in the 'criterion' namespace.
 */

define(['cilantro/define/events', 'cilantro/rest/resource', 'cilantro/define/conceptmanager',
        'cilantro/define/criteriamanager'],

    function(Events, Resource, ConceptManager, CriteriaManager) {

        var dom = {
            criteria: $('#criteria'),
            pluginPanel: $('#plugin-panel')
        };

        /*
         * When a new category is activated, the list of available criteria
         * must be filtered to only represent those in that category.
         */

        dom.criteria.current = null;

        // temporary binding to ShowConceptEvent until internals are
        // cleaned up
        dom.criteria.bind(Events.ACTIVATE_CRITERION + ' ShowConceptEvent',

            function(evt, id) {

                if (dom.criteria.current === id)
                    return false;
                dom.criteria.current = id;

                CriterionCollection.ready(function() {

                    var target = this.store[id];
                    target.addClass('active');
                    target.siblings().removeClass('active');

                    var data = target.data();
                    dom.criteria.trigger(Events.SYNC_CATEGORY,
                        [data.category.id, id]);

                    var conditions = CriteriaManager.retrieveCriteriaDS(id);

                    if (ConceptManager.isConceptLoaded(id)) {
                        ConceptManager.show({id: id}, conditions);
                    } else {
                        $.ajax({
                            url: target.data('uri'),
                            dataType:'json',
                            beforeSend: function() {
                                dom.pluginPanel.block();
                            },
                            complete: function() {
                                dom.pluginPanel.unblock();
                            },
                            success: function(json) {
                                ConceptManager.show(json, conditions);
                            }
                        });
                    }
                });
            }
        );

        dom.criteria.delegate('div', 'click', function(evt) {
            clearTimeout(timeout);
            $(this).trigger(Events.ACTIVATE_CRITERION,
                [$(this).data('id')]);
            $(this).trigger(Events.DEACTIVATE_DESCRIPTION);
        });

        return CriterionCollection;
    }
);
