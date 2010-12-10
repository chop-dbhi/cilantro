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

    ['define/criteria2', 'rest/datasource'],

    function(criteria, mod_datasource) {

        var tmpl = $.jqotec([
            '<div data-id="<%= this.id %>">',
                '<b><%= this.name %></b><br>',
                '<span><%= this.category.name %></span>',
            '</div>'
        ].join(''));

        $(function() {

            var cache = {},
                initial = true;

            var dom = {
                search: $('#search'),
                results: $('<div id="search-results"></div>').appendTo('body'),
                noresults: $('<p style="font-style:italic">No Results Found</p>')
            };

            dom.results.delegate('div', 'click', function(evt) {
                var target = $(this);
                target.trigger('activate-criterion', [target.data('id')]);
            });

            /*
             * executes the first time the search is used.
             * this is mainly to ensure the DOM is ready prior to relying
             * on the external components such as the criteria cache and
             * position of the search input. secondarily, not everyone uses
             * the search, so it prevents performing unnecessary operations
             */
            function init() {
                var src = criteria.src.criteria.get();

                var rWidth = dom.results.outerWidth(),
                    sOffset = dom.search.offset(),
                    sHeight = dom.search.outerHeight(),
                    sWidth = dom.search.outerWidth();

                dom.results.css({
                    left: sOffset.left - (rWidth - sWidth) / 2.0,
                    top: sOffset.top + sHeight + 5
                });

                var i, e, d;
                for (i in src) {
                    d = src[i].data();
                    e = jQuery($.jqote(tmpl, d)).data(d);
                    cache[i] = e;
                    dom.results.append(e);
                }
                initial = false;
            };


            dom.search.autocomplete2({
                success: function(value, json) {
                    if (initial) init();

                    dom.noresults.detach();
                    // show div, but hide results up front
                    dom.results.show().children().hide();

                    if (json.length) {
                        $.each(json, function() {
                            if (cache[this])
                                cache[this].show();
                        });
                    } else {
                        dom.noresults.prependTo(dom.results);
                    }
                }
            }, null, 50); 

            dom.search.bind({
                'blur': function(evt) {
                    dom.results.fadeOut();
                },
                
                'focus': function(evt) {
                    var val = dom.search.val();
                    if (val && val !== dom.search.attr('placeholder'))
                        dom.results.fadeIn('fast');
                }
            });

        });
    }
);
