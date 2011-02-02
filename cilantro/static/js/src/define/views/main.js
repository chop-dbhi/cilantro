define('define/views/main',
        
    [
        'define/views/category',
        'define/views/criterion',
        'define/views/search'
    ],

    function() {

        var i, k, e, m = {};

        for (i = arguments.length; i--;) {
            e = arguments[i];
            for (k in e) m[k] = e[k];
        }

        return m;
    }
);
