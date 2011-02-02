define('lib/clerk', function() {

    var clerk;

    (function () {

        if (!Array.prototype.indexOf) {

            Array.prototype.indexOf = function(searchElement /*, fromIndex */) {
                "use strict";

                if (this === void 0 || this === null)
                    throw new TypeError();

                var t = Object(this);
                var len = t.length >>> 0;
                if (len === 0)
                    return -1;

                var n = 0;
                if (arguments.length > 0) {
                    n = Number(arguments[1]);
                    if (n !== n)
                        n = 0;
                    else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
                        n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }

                if (n >= len)
                    return -1;

                var k = n >= 0
                      ? n
                      : Math.max(len - Math.abs(n), 0);

                for (; k < len; k++) {
                    if (k in t && t[k] === searchElement)
                        return k;
                }
                return -1;
            };

        }
       
        var Clerk = function() {

            /*
             * Stores references to all objects and names that have had a queue.
             */
            var refs = [];

            
            /*
             * Stores the state of each referenced object or name by their index
             * in the ``refs`` array.
             */
            var cache = {};

            this._index = function(ref, add) {
                add = (add === undefined) ? true : false;

                var idx = refs.indexOf(ref);

                if (idx == -1) {
                    if (add) idx = refs.push(ref) - 1;
                }

                return idx;
            };

            /*
             * Gets the existing state for an object or creates a new state object
             * if ``add`` is true.
             */
            this._state = function(idx) {
                var state = cache[idx];

                if (!state) {
                    cache[idx] = state = {
                        queue: [],
                        flushed: false
                    };
                }

                return state;
            };

            this._istate = function(ref, add) {
                return this._state(this._index(ref, add));
            };

            this._bind = function(name, obj) {
                // create the state relative to the name. when receiving the
                // messages, the associated object will be checked and used
                var nidx, oidx, idx, state;

                // let's try by name
                nidx = this._index(name, false);
                oidx = this._index(obj, false);

                if (nidx > -1 && oidx > -1)
                    return this._state(nidx);

                // neither exist
                if (oidx < 0) {

                    // create state relative to 'name'
                    state = this._istate(name)
                    // get index for the object
                    idx = this._index(obj);

                // the state for the object exists, let us setup the name
                // cache
                } else if (nidx < 0) {

                    state = this._istate(obj);
                    idx = this._index(name);

                }

                // set the object as a property
                state.object = obj;
                // set the reference for the object in cache
                cache[idx] = state;

                return state;

            };


            /*
             * Method: bind
             *
             * Used to bind a name/object pair for use by remote objects.
             * This establishes a name and the associated object up front, but
             * does not denote that the object is ready to receive the messages.
             */
            this.bind = function(name, obj) {
                this._bind(name, obj);
            };


            /*
             * Method: send
             *
             * The concept behind the 'send' method is to synchronously tell an
             * object to perform an action. These 'action' requests are synonymous
             * with sending a 'message' with instructions to an object. With
             * applications that have any asynchronous control flow, the object
             * receiving the message may not be quite ready to handle the request.
             * If the object has not deemed itself 'ready' to receive the messages,
             * a queue is created to hold the messages until it is ready. As a
             * result, this allows for sending messages to objects within a
             * synchronous control flow, even though the message may be received
             * (and consumed) in asynchronous control flow.
             *
             * Messages can be queued up for a defined object or queued up by name
             * for an object that does not yet exist, thus the first argument can
             * be an object or a int, string, null or bool.
             *
             * The last three arguments compose the message itself. The second
             * argument can be a function or a method name (a string) that exists
             * on the object (or object to be).  The third argument is an array
             * of arguments that will be passed in when the function gets called.
             * The fourth argument is an optional context that should be used to
             * define what 'this' references in the function scope. If not defined
             * the object itself will be what 'this' references.
             *
             */
            this.send = function(obj, func, args, cxt) {

                var state = this._istate(obj);
                   
                // immediately forward the request to the object if the queue
                // is already in a flushed state
                if (state.flushed == true) {

                    // use the referenced object instead of the name
                    if (state.object)
                        arguments[0] = state.object;

                    this._receive.apply(this,
                        Array.prototype.slice.call(arguments, 0));

                } else {

                    state.queue.push([func, args, cxt]);

                }

            };


            /*
             * Handles processing a single message.
             */
            this._receive = function(obj, func, args, cxt) {

                args = Array.prototype.slice.call(args, 0);

                // get a reference to the object method
                if (typeof func == 'string')
                    func = obj[func];

                cxt = cxt || obj;

                func.apply(cxt, args);

            };


            /*
             * Method: receive
             *
             * Messages can be sent to objects so, of course, they must be able to
             * be received. Messages can be obtained from the receiver one of two
             * ways, the object can request their messages or they can be given
             * their messages when they are 'ready'.
             *
             * The second method is actually setup the first time a message is sent
             * to an object (in the 'send' method). This method is only available
             * when the message queues are created for an object that is already
             * defined (as oppose to a named queue). An event handler is bound to
             * the 'ready' event for the object, so when the 'ready' event is
             * triggered by the object, all messages will be 'given' to the object.
             *
             * The first method can be used by both named queues and object queues.
             * For named queues, the name and the object that the messages apply to
             * must be passed into the 'receiver' method. For object queues, only
             * the object itself must be passed in.
             */
            this.receive = function(name, obj) {

                var state, message;

                if (typeof name !== 'object') {
                    state = this._bind(name, obj);
                } else {
                    state = this._istate(name);
                    obj = name;
                }

                if (state.flushed == true)
                    return;

                while (state.queue[0]) {
                    message = state.queue.shift();
                    this._receive.apply(this, [obj].concat(message));
                }

                state.flushed = true;

            };


            /*
             * Method: peek
             *
             * Returns the queue for the given object or name, if one exists.
             */
            this.peek = function(obj) {

                var state = this._istate(obj, false);

                if (state)
                    return state.queue;

            };

        };

        window.clerk = clerk = new Clerk;

    })();

});
