/*
 *  paralljs
 *  http://github.com/switer/paralljs
 *
 *  Copyright (c) 2013 "switer" guankaishe
 *  Licensed under the MIT license.
 *  https://github.com/switer/paralljs/blob/master/LICENSE
 */

'use strict;'

/**
 *  Parall enter funtion
 *  Create parall instance
 */
function Parall (/*[parallFunc1, parallFunc2, ...., parallFuncN]*/) {

    var args = util.slice(argument),
        parallHandlers = args.sift(),
        stateListeners = {},
        globalStateListeners = [];

    var parall = {

        // add a parall handler to parall array
        parall: function (parallHandler) {

            parallHandlers.push(parallHandler);
            return parall;
        },
        // state change listener
        change: function (/*[stateName], [listener]*/) {
            
        },
        before: function () {
            
        },
        done: function () {
            
        },
        end: function () {
            
        },
        start: function () {

            util.each(parallHandlers, function (handler, index) {
                util.invoke(handler, parall, [parall, index]);
            });

            util.batch(parallHandlers, args.unshift(parall));
            return parall;
        }
    }


    return parall;
}


var util = {
    /**
      * forEach
      * I don't want to import underscore, is looks like so heavy if use in chain
      */
    each: function(obj, iterator, context) {
        context = context || this;
        if (!obj) return;
        else if (obj.forEach) {
            obj.forEach(iterator);
        } else if (obj.length === +obj.length){
            for (var i = 0; i < obj.length; i++) {
                iterator.call(context, obj[i], i);
            }
        } else {
            for (var key in obj) {
                iterator.call(context, obj[key], key);
            }
        }
    },
    /**
      *  invoke handlers in batch process
      */
    batch: function (handlers /*, params*/) {
        var args = this.slice(arguments);
        args.shift();
        util.each(handlers, function (handler) {
            if (handler) {
                // util.invoke(handler, this, args);
                handler.apply(this, args);
            }
        });
    },
    /**
     *  Array.slice
     */
    slice: function (array) {
        return Array.prototype.slice.call(array);
    },
    /**
     *  Function.bind
     */
    bind: function (context, func) {
        return function () {
            func.apply(context, arguments);
        }
    },
    /**
     *  function call simple encapsulation
     */
    invoke: function (handler, context) {
        var args = this.slice(arguments);
        args = args.pop();
        try {
            handler.apply(context, args);
        } catch (e) {
            
        }
    }
}


// AMD/CMD/node/bang
if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = Parall;
    }
    exports.Parall = Parall;
} else {
    this.Parall = Parall;
}