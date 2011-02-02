define('define/models/main',
        
    [
        'define/models/category',
        'define/models/criterion'
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
