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

            var args = util.slice(arguments),
                stateName = util.type(args[0]) == 'string' ? args[0]: null,
                listener = util.type(args[0]) == 'function' ? args[0]: args[1];

            if (util.type(listener) != 'function') {
                throw new Error('Illegal state listener!');
            }
            if (stateName) {
                stateListeners[stateName] = stateListeners[stateName] || [];
                stateListeners[stateName].push(listener);
            } else {
                globalStateListeners.push(listener);
            }

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
    },
    /**
     *  Get a object type
     **/
    type: function (obj) {
        var type;
        if (obj == null) {
            type = String(obj);
        } else {
            type = Object.prototype.toString.call(obj).toLowerCase();
            type = type.substring(8, type.length - 1);
        }
        return type;
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