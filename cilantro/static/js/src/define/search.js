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

define('define/search',

    ['define/events', 'define/criteria2', 'rest/resource'],

    function(Events, CriterionCollection, Resource) {

        var template = [
            '<div data-id="<%= this.id %>">',
                '<b><%= this.name %></b><br>',
                '<span><%= this.category.name %></span>',
            '</div>'
        ].join('');

        var ResultCollection;

        $(function() {

            var dom = {
                search: $('#search'),
                results: $('<div id="search-results"></div>').appendTo('body'),
                noresults: $('<p style="font-style:italic">No Results Found</p>')
            };

            dom.results.delegate('div', 'click', function(evt) {
                var target = $(this);
                target.trigger(Events.ACTIVATE_CRITERION, [target.data('id')]);
            });

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

                    /*
                     * executes the first time the search is used.
                     * this is mainly to ensure the DOM is ready prior to relying
                     * on the external components such as the criteria cache and
                     * position of the search input. secondarily, not everyone uses
                     * the search, so it prevents performing unnecessary operations
                     */

                    var rWidth = dom.results.outerWidth(),
                        sOffset = dom.search.offset(),
                        sHeight = dom.search.outerHeight(),
                        sWidth = dom.search.outerWidth();

                    dom.results.css({
                        left: sOffset.left - (rWidth - sWidth) / 2.0,
                        top: sOffset.top + sHeight + 5
                    });

                });

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

                'blur': function(evt) {
                    dom.search.focused = false;
                    if (!dom.results.entered)
                        dom.results.trigger('mouseout');
                },
                
                'focus': function(evt) {
                    dom.search.focused = true;
                    var val = dom.search.val();
                    if (val && val !== dom.search.attr('placeholder'))
                        dom.results.fadeIn('fast');
                }

            });

            dom.results.bind({

                'mouseenter': function(evt) {
                    dom.results.entered = true;
                },

                'mouseleave': function(evt) {
                    dom.results.entered = false;
                    if (!dom.search.focused)
                        dom.results.fadeOut('fast');
                }

            });

        });

        return ResultCollection;
    }
);
