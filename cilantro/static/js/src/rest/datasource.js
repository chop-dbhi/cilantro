define(

    'rest/datasource',
    
    ['rest/basext'],
    
    function(BaseExt) {
    
        var DataSource = BaseExt.extend({});

        var AjaxDataSource = DataSource.extend({

            _poll: function(func, timeout, attempts) {
                attempts = (attempts === undefined) ? 5 : attempts;

                (function poll() {
                    if (!attempts--)
                        return;

                    var result = func();
                    if (result === undefined)
                        setTimeout(poll, timeout);
                })();
            },

            _cache: undefined,

            /*
             * If local caching is enabled (not browser caching), then try
             * returning the local cache. If either the local cache has not
             * been populated or local cache is not enabled, make the AJAX
             * request and then return it.
             */
            get: function(params, force) {
                force = force || false;
                params = params || {};

                if (!force && this._cache)
                    return this._cache;

                // make copy to prevent reference issues
                var self = this,
                    ajax = $.extend({}, this.ajax, params),
                    orig_success = ajax.success;

                ajax.success = function(resp) {
                    var decoded = self.decode(resp);
                    self._cache = decoded;
                    orig_success(resp, decoded);
                };

                // in progress, do not request again. poll locally
                // until request is finished
                if (!this.xhr || this.xhr.readyState == 4)
                    this.xhr = $.ajax(ajax);

                this._poll(function() {
                    if (self._cache)
                        return self._cache;
                }, 15);

                return this._cache;
            }
        }, {
            defargs: {
                ajax: {
                    url: window.location,
                    data: {},
                    success: function() {},
                    error: function() {},
                    cache: false 
                },
                decode: function(resp) { return resp; }
            }
        });

        return {
            ajax: AjaxDataSource
        };

    }
);
