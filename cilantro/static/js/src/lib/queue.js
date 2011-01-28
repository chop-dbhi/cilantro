function Queue() {

    // store your callbacks
    this._callbacks = [];

    // keep a reference to your arguments
    this._arguments = null;

    // all queues start off unflushed
    this._flushed = false;

};

Queue.prototype = {

    // adds callbacks to your queue
    add: function(fn) {

        // if the queue had been flushed, return immediately
        if (this._flushed) {

            fn.apply(fn, Array.prototype.slice.call(this._arguments));

        // otherwise push it on the queue
        } else {

            this._callbacks.push(fn);

        }
    },

    flush: function() {

        // note: flush only ever happens once
        if (this._flushed)
            return;

        // store your arguments for subsequent calls after flush()
        this._arguments = arguments;

        // mark that it's been flushed
        this._flushed = true;

        // shift 'em out and call 'em back
        while (this._callbacks[0]) {
            fn = this._callbacks.shift();
            fn.apply(fn, Array.prototype.slice.call(arguments));
        }
    }
};

