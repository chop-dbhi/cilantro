define('define/description',

    ['define/events'],

    function(Events) {

        $(function() {

            var dom = {
                description: $('<div id="description"></div>').appendTo('body')
            };

            dom.description.timeout = null;

            dom.description.bind(Events.ACTIVATE_DESCRIPTION, function(evt) {
                // TODO implement position

                clearTimeout(dom.description.timeout);

                var height, overflow,
                    target = $(evt.target).parent(),
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

            });

            dom.description.bind({
                'mouseover': function() {
                    clearTimeout(dom.description.timeout);
                },

                'mouseout': function() {
                    dom.description.trigger(Events.DEACTIVATE_DESCRIPTION, [200]);
                }
            });

            dom.description.bind(Events.DEACTIVATE_DESCRIPTION, function(evt, timeout) {

                dom.description.timeout = setTimeout(function() {
                    dom.description.fadeOut('fast');
                }, timeout);
                return false;

            });

        });

    }

);
