define('lib/clerk', function() {

    var clerk;
    (function () {
       
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


            /*
             * Gets the existing state for an object or creates a new state object
             * if ``create`` is true.
             */
            this._state = function(obj, create) {

                create = (create === undefined) ? true : false;

                var idx, state;

                idx = refs.indexOf(obj);

                if (idx === -1 || idx === undefined) {

                    if (!create) return;

                    // push an return the current index, not the next one
                    idx = refs.push(obj) - 1;

                    cache[idx] = state = {
                    
                        id: idx,
                        queue: [],
                        flushed: false

                    };

                    if (jQuery.isPlainObject(obj)) {

                        var ref = this;

                        jQuery(obj).bind('ready', function() {

                            ref.receive(obj);

                        });

                    }

                } else {

                    state = cache[idx];

                }

                return state;

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

                var state = this._state(obj);
                   
                // immediately forward the request to the object if the queue
                // is already in a flushed state
                if (state.flushed == true) {

                    // use the referenced object instead of the name
                    if (!!state.object)
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
                if (jQuery.type(func) == 'string') {

                    func = obj[func];

                }

                if (cxt === undefined)
                    cxt = obj;

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

                var state = this._state(name);

                if (state === undefined || state.flushed == true) {

                    return;

                }

                // store a reference to the object now that it exists
                if (jQuery.type(name) !== 'object') {

                    var idx = refs.push(obj) - 1;

                    cache[idx] = {
                        id: idx,
                        flushed: true,
                        queue: state.queue
                    };

                    // reference, so post flushed calls are applied to this object
                    // rather than the name
                    state.object = obj;

                } else {

                    obj = name;

                }

                var message;

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

                var state = this._state(obj, false);

                if (state)
                    return state.queue;

            };

        };

        window.clerk = clerk = new Clerk;


    })();

});
