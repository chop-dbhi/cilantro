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

define(

    'define/criteria2',

    ['rest/datasource'],

    function(mod_datasource) {

        var tmpl = $.jqotec([
            '<div data-id="<%= this.id %>">',
                '<div class="info"></div>',
                '<span class="name"><%= this.name %></span>',
                '<span class="description"><%= this.description %></span>',
            '</div>'
        ].join(''));

        var dom, src;

        $(function() {

            dom = {
                criteria: $('#criteria'),
                description: $('<div id="description"></div>').appendTo('body')
            };

            src = {
                criteria: new mod_datasource.ajax({
                    decode: function(json) {
                        var map = {};
                        $.each(json, function(i, e) {
                            var elem = jQuery($.jqote(tmpl, e)).data(e);
                            map[e.id] = elem;
                        });
                        return map;
                    },

                    ajax: {
                        url: dom.criteria.data('uri'),
                        cache: true,
                        success: function(json, decoded) {
                            $.each(json, function(i, e) {
                                dom.criteria.append(decoded[e.id]);
                            });
                        }
                    }
                })
            };

            src.criteria.get();

            /*
             * When a new category is activated, the list of available criteria
             * must be filtered to only represent those in that category.
             */

            dom.criteria.current = null;

            dom.criteria.bind({
                'activate-category': function(evt, id) {
                    // find all criterion objects that are associated with the
                    // category and show them
                    $.each(src.criteria.get(), function() {
                        (this.data('category').id === id) ? this.show() : this.hide();
                    });
                },

                'activate-criterion': function(evt, id) {
                    // test cache
                    if (dom.criteria.current === id)
                        return false;
                    dom.criteria.current = id

                    var target = src.criteria.get()[id];
                    target.addClass('active');
                    target.siblings().removeClass('active');

                    var data = target.data();
                    dom.criteria.trigger('sync-category', [data.category.id, id]);
                }
            });


           /*
            * User-triggerable events
            */
            dom.description.timeout = null;

            dom.criteria.delegate('div > .info', 'mouseover', function() {
                clearTimeout(dom.description.timeout);

                var height, overflow,
                    target = $(this).parent(),
                    offset = target.offset(),
                    width = target.outerWidth(),
                    description = target.children('.description').html();

                // refresh contents before getting height
                dom.description.html(description);

                height = dom.description.outerHeight();
                overflow = $(window).height() - (height + offset.top);

                dom.description.css({
                    left: offset.left + width + 20,
                    top: offset.top + (overflow < 0 ? overflow : 0)
                }).show();

            }).delegate('div > .info', 'mouseout', function() {
                dom.description.timeout = setTimeout(function() {
                    dom.description.fadeOut('fast');
                }, 1000);
            });

            dom.criteria.delegate('div', 'click', function(evt) {
                $(this).trigger('activate-criterion',
                    [$(this).data('id')]);
            });

            dom.description.bind({
                'mouseover': function() {
                    clearTimeout(dom.description.timeout);
                },

                'mouseout': function() {
                    dom.description.timeout = setTimeout(function() {
                        dom.description.fadeOut('fast');
                    }, 200);
                }
            });

        }); 

        return {
            src: src
        };
    }
);
