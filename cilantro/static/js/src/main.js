define(
    [
        'cilantro/lib/jquery.ui',
        'cilantro/lib/jquery.block',
        'cilantro/lib/jquery.jqote2',
        'cilantro/lib/jquery.scrollto',
        'cilantro/utils/ajaxsetup',
        'cilantro/utils/extensions',
        'cilantro/utils/html5fix',
        'cilantro/utils/sanitizer'
    ],
    
    function() {
        if (!window.JSON)
            require(['cilantro/lib/json2']);
            
        $.block.defaults.message = null;
        $.block.defaults.css = {};
        $.block.defaults.overlayCSS = {};
    }
);
