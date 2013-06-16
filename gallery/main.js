// Patch mediator prior to loading Cilantro to support the stream
require(['jquery', 'mediator'], function($, mediator) {
    var __slice = [].slice,
         _publish = mediator.publish,
        expanded = false,
        stream = $('#stream ul'),

        navigator = $('#gallery-nav'),
        navToggle = $('#gallery-nav-toggle'),

        previewArea = $('#preview-area'),
        // For adjusting the span class..
        previewParent = previewArea.parent(),

        // For re-attaching the navigator..
        mainRow = navigator.parent();


    navToggle.click(function() {
        navigator.toggleState();
    });

    navigator.toggleState = function() {
        if (navigator.is(':visible')) {
            navigator.collapse();
        } else {
            navigator.expand();
        }
    }

    navigator.collapse = function() {
        if (navigator.is(':visible')) {
            navigator.detach();
            previewArea.removeClass('preview-ui');
            previewParent.toggleClass('span8 span12');
            navToggle.text('Show Nav');
        }
    }

    navigator.expand = function() {
        if (!navigator.is(':visible')) {
            navigator.prependTo(mainRow);
            previewArea.addClass('preview-ui');
            previewParent.toggleClass('span8 span12');
            navToggle.text('Hide Nav');
        }
    }

    // Wrapper for adding items to the stream. Each argument is JSON.stringified
    // and rendered in a `pre'
    mediator.publish = function(channel) {
        var i, li, data = [];

        // Call the real publish function
        _publish.apply(null, __slice.call(arguments, 0));

        // Remaining arguments are the data
        args = __slice.call(arguments, 1);

        // Add channel name
        data.push('<strong>' + channel + '</strong>');

        // JSON stringify each argument
        for (i = 0; i < args.length; i++) {
            // Anchor toggle
            data.push('<a href=#>'+ i +'</a>')
            // Data contents
            data.push('<pre>' + JSON.stringify(args[i], null, ' ') + '</pre>');
        }

        li = $('<li>').html(data.join(' '));
        // Show if in the expanded state
        if (expanded) li.find('pre').show();
        // Add to stream
        stream.prepend(li);
    }

    // Toggle view/hide argument contents
    stream.on('click', 'a', function(event) {
        event.preventDefault();
        $(this).next().toggle();
    });

    // Clear the stream
    $('#clear-stream').on('click', function(event) {
        stream.html('');
    });

    $('#expand-stream').on('click', function(event) {
        expanded = !expanded;
        if (expanded) {
            stream.find('pre').show();
            $(this).text('Collapse');
        } else {
            stream.find('pre').hide();
            $(this).text('Expand');
        }
    });

    // Build navigation
    var i, link, view, region, layout;

    var components = $('#components ul');

    // Constructs the list items and links for loading modules
    function moduleLinks(section, modules) {
        var i, len, head, link, mod;
        if (!(len = modules.length)) return;

        head = $('<li>')
            .text(section)
            .addClass('nav-header')

        components.append(head)

        for (i = 0; i < len ; i++) {
            mod = modules[i];

            link = $('<a>')
                .data('module', mod[0])
                .attr('href', '#' + mod[1].replace(' ', '-').toLowerCase())
                .text(mod[1]);
            components.append($('<li>').append(link));
        }
    }

    moduleLinks('Views', this.views);
    moduleLinks('Regions', this.regions);
    moduleLinks('Layouts', this.layouts);
    moduleLinks('Workflows', this.workflows);

    // Bind click to load modules
    components.on('click', 'a', function(event) {
        var anchor = $(this),
            modname = anchor.data('module');

        // Update to reflect currently active link
        anchor.parent()
            .addClass('active')
            .siblings()
            .removeClass('active');

        // The module is expected to return a callback that takes
        // the preview area DOM element. This primarily is
        // useful for rendering the view at an arbitary
        // time (e.g. when data finally loads)

        require([modname], function(handler) {
            handler(previewArea, navigator);
        });
    });

    // Load module based on location hash
    var hash;
    if ((hash = window.location.hash)) {
        components.find('a[href=' + hash + ']').click();
    }

    // Setup remaining components. This is intentionally loaded *after* the
    // mediator module was loaded.
    require(['cilantro'], function(c) {
        var builtinChannel = $('#builtin-channel'),
            builtinChannelData = $('#builtin-channel-data'),
            customChannel = $('#custom-channel'),
            customChannelData = $('#custom-channel-data');

        // Populate built-in channels
        var key, value;
        for (key in c) {
            if (key === key.toUpperCase() && typeof (value = c[key]) == 'string') {
                var option = $('<option>').val(value).text(value);
                builtinChannel.append(option);
            }
        }

        $('#builtin-channel-form').on('submit', function(event) {
            event.preventDefault();
            var data, args = [builtinChannel.val()];
            if (data = $.trim(builtinChannelData.val())) {
                args.push(JSON.parse(data));
            }
            c.publish.apply(null, args);
        });

        $('#custom-channel-form').on('submit', function(event) {
            event.preventDefault();
            var data, args = [customChannel.val()];
            if (data = $.trim(customChannelData.val())) {
                args.push(JSON.parse(data));
            }
            c.publish.apply(null, args);
        });

    });

});
