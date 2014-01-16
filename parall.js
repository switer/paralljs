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

    var args = util.slice(arguments),
        beginParallHandlers = args.shift(),
        parallHandlers = [],
        stateListeners = {},
        globalStateListeners = [],
        beforeHandlers = [],
        doneHandlers = [],
        _data = {},
        isStoping = false,
        states = {};

    /**
     *  trigger state change
     **/
    function onstatechange (stateName) {
        // get state handlers
        stateHandlers = stateListeners[stateName];
        
        // notify state change listener with statename
        util.batch(stateHandlers, parall, states[stateName]);
        // notify gloabl state change listener
        util.batch(globalStateListeners, parall, util.extend({}, states));
    }
    function filter () {
        return isStoping;
    }

    /**
     *  Parall instance
     **/
    var parall = {
        
        /**
         *  Run before each parallel function
         **/
        before: function (beforeHandler) {
            beforeHandlers.push(beforeHandler);
            return parall;
        },
        /**
         *  state change listener
         **/
        change: function (/*[stateName], [listener]*/) {
            // filter judge
            if (filter()) return parall;

            var args = util.slice(arguments),
                stateName = util.type(args[0]) == 'string' ? args[0]: null,
                listener = util.type(args[0]) == 'function' ? args[0]: args[1];

            if (util.type(listener) != 'function') {
                throw new Error('Illegal state listener!');
            }
            if (stateName) { // Listen by statename

                stateListeners[stateName] = stateListeners[stateName] || [];
                stateListeners[stateName].push(listener);

            } else { // Listen all states change

                globalStateListeners.push(listener);
            }

            return parall;

        },
        /**
         *  Save data in current parall instance
         */
        data: function (key, data) {
            // set data
            if (key && data) {
                _data[key] = data;
                return parall;
            }
            // get data value by key
            else if (key && !data) { 
                return _data[key];
            }
            // return all data of currently parall
            else {
                return util.extend({}, _data);
            }
        },
        end: function () {
            if (filter()) return;
            isStoping = true;

            util.batch(doneHandlers, parall);
            return parall;
        },
        final: function (doneHandler) {
            doneHandlers.push(doneHandler);
            return parall;
        },
        /**
         *  add a parall handler to parall array
         **/
        parall: function (parallHandler) {
            var args = util.slice(arguments);
            args.shift();

            // with params
            parallHandlers.push({
                handler: parallHandler,
                args: args
            });
            return parall;
        },
        /**
         *  change state
         **/
        state: function (stateName, stateValue) {
            if (!stateName && !stateValue) return util.extend({}, states);

            // filter judge
            if (filter()) return parall;

            if (util.type(stateName) == 'object') { // trigger in batch

                util.each(stateName, function (svalue, sname) {
                    states[sname] = svalue;
                    // trigger state change event
                    onstatechange(sname);
                });
            } else {

                states[stateName] = stateValue;
                // trigger state change event
                onstatechange(stateName);
            }
            return parall;
        },
        /**
         *  Starting the parall and it will invoke start handler
         */
        start: function () {

            var beginHandlerLength = beginParallHandlers.length;

            util.each(beginParallHandlers, function (handler, index) {
                // if (filter()) return true;

                // AOP before handler
                util.batch.apply(util, [beforeHandlers, parall, index].concat(args));
                // parall function invoke
                handler.apply(parall, [parall, index].concat(args));
            });
            // I don't want to cancat parallHandlers with beginParallHandlers.
            util.each(parallHandlers, function (handlerObj, index) {
                // if (filter()) return true;

                var handler = handlerObj.handler,
                    args = handlerObj.args;
                // plus with begin length
                index += beginHandlerLength;

                // AOP before handler
                util.batch.apply(util, [beforeHandlers, parall, index].concat(args));
                // parall function invoke
                handler.apply(parall, [parall, index].concat(args));
            });

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
                if(iterator.call(context, obj[i], i)) break;
            }
        } else {
            for (var key in obj) {
                if(stop = iterator.call(context, obj[key], key)) break;
            }
        }
    },
    /**
     *  Object extend api
     **/
    extend: function (obj, extObj, isNotOverRide) {

        this.each(extObj, function (value, key) {
            if (extObj.hasOwnProperty(key)) {
                if (isNotOverRide && obj.hasOwnProperty(key)) {
                    return;
                } else {
                    obj[key] = value;
                }
            }
        });
        return obj;
    },
    /**
      *  invoke handlers in batch process
      */
    batch: function (handlers /*, params*/) {
        var args = this.slice(arguments);
        args.shift();
        util.each(handlers, function (handler) {
            if (handler) {
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