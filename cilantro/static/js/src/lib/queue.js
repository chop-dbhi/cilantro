function Queue() {

    // store your callbacks
    this._callbacks = [];

    // all queues start off unflushed
    this._flushed = false;

};

Queue.prototype = {

    // adds callbacks to your queue
    add: function(fn) {
        // remove ``fn`` from list of arguments. these passed in
        // arguments will be used to return a curried function
        var args = Array.prototype.slice.call(arguments, 1);

        // if the queue had been flushed, return immediately
        if (this._flushed) {

            fn.apply(fn, args);

        // otherwise push it on the queue
        } else {


            this._callbacks.push(function() {
                var nargs = args.concat(Array.prototype.slice.call(arguments));  
                fn.apply(fn, nargs);
            });

        }
    },

    flush: function() {

        // note: flush only ever happens once
        if (this._flushed)
            return;

        // mark that it's been flushed
        this._flushed = true;

        // shift 'em out and call 'em back
        while (this._callbacks[0]) {
            fn = this._callbacks.shift();
            fn.apply(fn, Array.prototype.slice.call(arguments));
        }
    }
};

