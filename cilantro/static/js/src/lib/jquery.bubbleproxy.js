/*
 * jQuery BubbleProxy Plugin
 *
 * Author: Byron Ruth (2010)
 * Licensed under the MIT license
 *
 * The 'bubbleproxy' plugin provides a way of forwarding an event trigger
 * to anywhere in the DOM.
 */

(function($) {

    $.bubbleproxy = function(config, root) {
        return $(root || 'body').bubbleproxy(config);
    };

    $.fn.bubbleproxy = function(config) {

        /*
         * Config Options:
         *
         *      The ``config`` object's keys are any valid event types e.g.
         *      'click', 'custom', and 'click.mynamespace'.
         *      
         *      The ``config`` object's values are objects themselves
         *      associated with the defined event type. The parameters are as
         *      follows:
         *
         *          - ``listeners`` (required) - an array of jQuery objects or
         *          CSS selector strings
         *
         *          - ``stopPropagation`` - a boolean that calls
         *          ``evt.stopPropagation()`` if true. take caution when
         *          setting this flag since this will prevent further bubbling.
         *          in the same respect, circular bubbling may occur if this is
         *          not set AND the target handler (or an ancestor handler)
         *          does not stop the bubbling from reaching ``this`` again.
         *          default is true.
         *
         *          - ``sources`` - an array of jQuery objects or CSS selector
         *          strings. this can be set to restrict proxying depending on
         *          the source of the event trigger.
         *
         */

        config = config || {};

        if (typeof config == 'string') {
            nconfig = {};
            nconfig[arguments[0]] = arguments[1] || {}
            config = nconfig;
        }

        // for reference within closures
        var self = this;

        // iterate over each event type and setup the binds
        $.each(config, function(event, config) {

            // if there are no listeners defined, skip
            if (!config.listeners)
                return;

            // TODO this does not consider new elements that match the
            // selector. an option may be to refresh the object if the selector
            // is passed or used the cache if it is already a jQuery object

            // turn into jQuery objects
            var listeners = $.map(config.listeners || [], function(e) {
                return !!e.jquery ? e : $(e);
            });

            // reduce down to selectors to work with $.fn.is(...)
            var sources = $.map(config.sources || [], function(e) {
                return !!e.jquery ? e.selector : e;
            });

            // stopPropagation default is true
            var stopPropagation = (config.stopPropagation === undefined) ?
                true : config.stopPropagation;

            self.bind(event, function(evt) {

                if (!!sources.length) {
                    var pass = false,
                        source = $(evt.target);

                    $.each(sources, function() {
                        pass = !source.is(this);
                        return pass;
                    });

                    if (!pass) return;
                }

                var args, cevt,
                    data = Array.prototype.slice.call(arguments, 1);

                $.each(listeners, function() {
                    // makes copies for each listener so there is no conflict
                    // with stopProp and prevDef
                    cevt = $.extend($.Event(evt.type), evt);
                    args = data.slice(0);
                    args.unshift(cevt);

                    if (stopPropagation)
                        cevt.stopPropagation();

                    this.each(function() {
                        $.event.trigger(cevt, args, this, true);
                    });
                });
            });
        });

        return this;
    };

})(jQuery);

