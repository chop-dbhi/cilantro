/*
 * The search interface performs a GET to the CriterionCollection
 * resource with the ``q`` parameter, performing a filtering operation
 * on the objects.
 *
 * The response is a list of criterion IDs which can be used to filter
 * an existing list of criterion objects.
 *
 * On Load:
 * - get all criterion objects from local datastore, render the results
 *   box
 *
 * User Interactions:
 * - on keyup, trigger the search-criterion
 *
 * All events are in the 'criterion' namespace.
 */

define(['cilantro/define/events', 'cilantro/define/criteria2', 'cilantro/rest/resource'],

    function(Events, CriterionCollection, Resource) {

        var template = [
            '<div data-id="<%= this.id %>">',
                '<b><%= this.name %></b><br>',
                '<span><%= this.category.name %></span>',
            '</div>'
        ].join('');

        var ResultCollection;

        var dom = {
            search: $('#search'),
            results: $('<div id="search-results"></div>').appendTo('body'),
            noresults: $('<p style="font-style:italic">No Results Found</p>')
        };

        /*
         * Sets the position of the search results div.
         *
         * Defined as a function since it is used once the results are
         * populated, but also when the window is resized.
         */
        function setResultsPosition() {

            var rWidth = dom.results.outerWidth(),
                sOffset = dom.search.offset(),
                sHeight = dom.search.outerHeight(),
                sWidth = dom.search.outerWidth();

            dom.results.css({
                left: sOffset.left - (rWidth - sWidth) / 2.0,
                top: sOffset.top + sHeight + 5
            });

        };

        // all this trouble of copying the original CriterionCollection
        // to ensure there is no discrepancy between the search results
        // and the available options. the scenario that would lead to
        // confusion is if the server updated between the CriterionCollection
        // being populated and the user searches.
        CriterionCollection.ready(function() {

            ResultCollection = new Resource({

                store: CriterionCollection._,
                template: template

            }).ready(function() { 

                dom.results.html(this.dom);
                setResultsPosition();

            });

            /*
             * Performs a GET to the server for the IDs of all objects that
             * were a hit. The IDs are then iterated over and only those
             * objects are shown.
             */
            dom.search.autocomplete2({
                success: function(value, json) {
                    dom.noresults.detach();
                    // show div, but hide results up front
                    dom.results.show().children().hide();

                    if (json.length) {
                        $.each(json, function() {
                            if (ResultCollection.store[this])
                                ResultCollection.store[this].show();
                        });
                    } else {
                        dom.noresults.prependTo(dom.results);
                    }
                }
            }, null, 50);

        });

        dom.results.entered = false;

        // this can be defined outside of the callback since nothing
        // directly depends on the ResultCollection itself
        dom.search.bind({

            /*
             * When the search input loses focus, make sure the user is not
             * interacting with the results box before hiding it.
             *
             * TODO should this fire a custom event rather than relying on
             * 'mouseout'?
             */
            'blur': function(evt) {
                dom.search.focused = false;
                if (!dom.results.entered)
                    dom.results.trigger('mouseleave');
            },
            
            /*
             * If the user performed a search previously, show the state of
             * the results as they were.
             */
            'focus': function(evt) {
                dom.search.focused = true;
                var val = dom.search.val();
                if (val && val !== dom.search.attr('placeholder')) {
                    dom.results.fadeIn('fast');
                }
            }

        });

        dom.results.bind({

            /*
             * When the mouse is on the search results, regardless if the
             * search input loses focus, the results should not hide.
             * Therefore this flag must be set.
             */
            'mouseenter': function(evt) {
                dom.results.entered = true;
            },

            /*
             * Check to ensure the search input is not in focus before the
             * results magically go away.
             */
            'mouseleave': function(evt) {
                dom.results.entered = false;
                if (!dom.search.focused)
                    dom.results.fadeOut('fast');
            }

        });

        /*
         * Fire the ACTIVATE_CRITERION event when any of the results are
         * clicked.
         */
        dom.results.delegate('div', 'click', function(evt) {

            var target = $(this);
            target.trigger(Events.ACTIVATE_CRITERION, [target.data('id')]);

        });

        /*
         * This is definitely an edge case, but a user may be in the middle
         * of searching and decided to resize the window so we need to reset
         * the search results position (this is only noticable when the
         * search input is in focus).
         */
        $(window).bind('resize', function(evt) {

            setResultsPosition();

        });

        return ResultCollection;
    }
);
