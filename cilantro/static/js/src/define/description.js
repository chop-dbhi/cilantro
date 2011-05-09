define(['cilantro/define/events'],

    function(Events) {

        var dom = {
            description: $('<div id="description"></div>').appendTo('body')
        };

        dom.description.timeout = null;

        dom.description.bind(Events.ACTIVATE_DESCRIPTION, function(evt) {
            // TODO implement position

            clearTimeout(dom.description.timeout);

            var height, overflow,
                target = $(evt.target),
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

            return false;
        });

        dom.description.bind(Events.DEACTIVATE_DESCRIPTION, function(evt, timeout) {
            timeout = timeout || 0;
            dom.description.timeout = setTimeout(function() {
                dom.description.fadeOut(100);
            }, timeout);
            return false;

        });

        dom.description.bind({
            'mouseover': function() {
                clearTimeout(dom.description.timeout);
            },

            'mouseout': function() {
                dom.description.trigger(Events.DEACTIVATE_DESCRIPTION, [200]);
            }
        });

    }

);
