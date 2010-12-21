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

define('define/criteria2',

    ['define/events', 'rest/resource', 'define/conceptmanager',
        'define/criteriamanager', 'define/description'],

    function(Events, Resource, ConceptManager, CriteriaManager) {

        var template = [
            '<div data-id="<%= this.id %>">',
                '<div class="icon info"></div>',
                '<span class="name"><%= this.name %></span>',
                '<span class="description"><%= this.description %></span>',
            '</div>'
        ].join('');

        var CriterionCollection;

        $(function() {

            var dom = {
                criteria: $('#criteria')
            };

            CriterionCollection = new Resource({

                url: dom.criteria.data('uri'),
                template: template

            }).ready(function() {

                dom.criteria.html(this.dom);
                
            });

            /*
             * When a new category is activated, the list of available criteria
             * must be filtered to only represent those in that category.
             */

            dom.criteria.current = null;

            dom.criteria.bind(Events.ACTIVATE_CATEGORY,

                function(evt, id) {

                    // find all criterion objects that are associated with the
                    // category and show them
                    CriterionCollection.ready(function() {

                        $.each(this.store, function() {
                            (this.data('category').id === id) ? this.show() : this.hide();
                        });

                    });
                }
            );

            // temporary binding to ShowConceptEvent until internals are
            // cleaned up
            dom.criteria.bind(Events.ACTIVATE_CRITERION + ' ShowConceptEvent',
                
                function(evt, id) {

                    if (dom.criteria.current === id)
                        return false;
                    dom.criteria.current = id

                    CriterionCollection.ready(function() {

                        var target = this.store[id];
                        target.addClass('active');
                        target.siblings().removeClass('active');

                        var data = target.data();
                        dom.criteria.trigger(Events.SYNC_CATEGORY,
                            [data.category.id, id]);

                        var conditions = null;

//                        CriteriaManager.

                        // ideal API
//                        ConceptManager.show(id);
                        var conditions = CriteriaManager.retrieveCriteriaDS(id);

                        if (ConceptManager.isConceptLoaded(id)) {
                            ConceptManager.show({id: id}, conditions);
                        } else {
                            $.ajax({
                                url: target.data('uri'),
                                dataType:'json',
                                success: function(json) {
                                        ConceptManager.show(json, conditions);
                                }
                            });
                        }
                    });
                }
            );


            /*
             * Delegation for handling the mouse hovering the '.info' element.
             * This must notify the description box of the event
             */
            dom.criteria.delegate('div > .info', 'mouseover', function() {
                $(this).trigger(Events.ACTIVATE_DESCRIPTION, ['right']);
            });

            /*
             * Delegation for handling the mouse leaving the '.info' element.
             * This is necessary since the user may be going to interact with
             * the description box.
             */
            dom.criteria.delegate('div > .info', 'mouseout', function() {
                $(this).trigger(Events.DEACTIVATE_DESCRIPTION, [500]);
            });

            dom.criteria.delegate('div', 'click', function(evt) {
                $(this).trigger(Events.ACTIVATE_CRITERION,
                    [$(this).data('id')]);
            });

        });

        return CriterionCollection;
    }
);
