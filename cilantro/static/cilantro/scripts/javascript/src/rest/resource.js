/*
 * Resource - a ``resource`` provides an interface for retrieving and
 * interacting with some data.
 */
define(['cilantro/vendor/base'],

    function() {

        /*
         * A Resource wraps functionality surrounding some data
         * involving preparing it (i.e. loading and parsing), creating
         * the respective DOM elements (if necessary), and providing a
         * micro-API surrounding the Resource.
         *
         * If the Resource represents remote data, by providing some very
         * basic search functionality for the Resource, this will reduce
         * the network overhead of making requests.
         *
         * There are two approaches to using a Resource:
         *     - a Resource that represents data from a remote source
         *     - a Resource that represents data from a local source
         *
         * A remote resource could look like this:
         *
         *      var Remote = new Resource({
         *          url: 'data.json'
         *      });
         *
         *      Remote.ready(function() {
         *          $('body').append(this.dom);
         *      });
         */
        Resource = Base.extend({

            url: '',

            dataType: 'json',

            timeout: 5 * 1000, // 5 seconds

            interval: 15,

            uid: 'id',

            /*
             * The ``_setup`` function is intended to provide a generic
             * interface for setting up the internal components of the
             * Resource. This should only be called once, therefore is
             * tests to make the Resource has not already been loaded.
             */
            _setup: function(data) {
                if (this.loaded === true)
                    return;

                // Create the local store from the initial data. As of now
                // the raw data is hidden from the public API and used only
                // internally. This is intended to be the 'pristine' copy
                // of the data which its original order.
                var base = $.isArray(data) ? [] : {};

                this._ = $.extend(true, base, data);
                this.store = {};

                // If a template is defined, call render to make the
                // DOM elements available for use. It can be assumed that
                // if a template is defined as a property, this will be
                // intended representation of the data.
                if (this.template)
                    this.dom = this.render(this.template);

                this.loaded = true;
            },

            /*
             * Performs a simple aynchronous GET request and executes the
             * setup step once the response is received.
             */
            _fetch: function() {

                var self = this;

                var options = {
                    type: 'GET',
                    url: this.url,
                    dataType: this.dataType,
                    success: function(resp) {
                        self._setup(resp);
                    }
                };

                this.xhr = $.ajax(options);
            },

            /*
             * The primary interface for the Resource. This is the "safe"
             * method to be used when requiring access to properies on the
             * Resource itself, such as the data.
             *
             * A Resource is lazily evaluated and populated as needed to
             * reduce unnecessary overhead. This method virtually makes the
             * Resource fully ready for use.
             *
             * It makes N attempts where N is the ``timeout`` / ``interface``
             * to receive the request for the remote data. If the ``store``
             * is already defined, that is used as local data for the
             * Resource and will not attempt to make the remote request.
             */
            ready: function(callback /*, attempts */) {
                callback = callback || function() {};

                if (this.loaded) {

                    callback.apply(this);

                } else {

                    // get current number of attempts or calculate
                    attempts = arguments[1] || parseInt(this.timeout / this.interval);

                    // the store has been set before a request has been made
                    // means the user explicitly set the store
                    if (this.store && !this.xhr)
                        this._setup(this.store);

                    // if the XHR object is not defined, the AJAX request has
                    // not been made
                    if (this.url && !this.xhr)
                        this._fetch();

                    if (!--attempts)
                        throw new Error('Failed to get a response');

                    // defines the 'polling' mechanism at 15 ms intervals until
                    // the ``store`` has been defined or the max timeout has been
                    // reached
                    var self = this;
                    setTimeout(function() {
                        self.ready(callback, attempts);
                    }, 15);
                }

                return this;
            },

            render: function(template /*, data */) {
                if (arguments.length === 1 && typeof template == 'object') {
                    data = template;
                    template = this.template;
                } else {
                    data = arguments[1] || this._;
                }

                if (!$.isArray(data))
                    data = [data];

                if (typeof template == 'string')
                    template = $.jqotec(template);

                var uid, estring, object, datum, elems, items = [];
                for (var i=0, l=data.length; i < l; i++) {
                    // get object
                    datum = data[i];

                    // compile template
                    estring = $.jqote(template, datum);

                    // create jQuery object and store off original data
                    object = $(estring).data(datum);

                    // if a uid is not defined, use the index as the uid
                    uid = (!this.uid) ? i : datum[this.uid];

                    // get unique identifier relative to the object
                    this.store[uid] = object;

                    // get raw DOM elements
                    items.push.apply(items, object.toArray());
                }

                return $(items);
            },

             grep: function(key, value /*, elements */) {
                var data = arguments[3] || this._;
                data = $.isArray(data) ? data : [data];

                var out;
                this.ready(function() {
                    out = $.grep(data, function(e, i) {
                        return $(e).data(key) === value;
                    });
                });
                return out;
            }

        });

        return Resource;
    }
);
