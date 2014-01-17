paralljs
========

Paralljs call each async function in parallel, let parallel async function callback fairily. 

## Install

```bash
npm install paralljs
```

## Usage
__use in node:__
```javascript
var Parall = require('paralljs');

Parall([
    function (parall, index) {
        setTimeout( function() {
            console.log(index); // 1
            parall.state('step1:finish', true);
            return;
        }, 1000);
    },
    function (parall, index) {
        // TODO
    }
])
.parall(function (parall, index) {
    setTimeout( function() {
        console.log(index); // 3
    }, 1000);
})
.change('step1:finish', function (parall, step1finish) {
    console.log(step1finish); // true
})
.final(function (parall) {
    // Run after call parall.end();
})
.start();
```

## API

### Parall(beginHandlers [, param1, param2, ..., paramN])
Instancing a parall intance and push parall functions with param which will be invoke when call parall.start() 
```javascript
Parall([func1, func2, func3], param);
```

### .before(beforeHandler)
Will be invoked before each parall function in sync
```javascript
Parall()
    .parall(func1)
    .parall(func2)
    .before(function (parall, index) {
        console.log('It will be invoked before each parall function')
    })
    .start();
```

### .change([stateName,] listener)
Listen parall state change
```javascript
Parall([function (parall) {
    setTimeout( function() {
        parall.state('xxchange', false);
    });
}], param)
.change('xxchange', function (parall, xxstate) {
    // Do some when call state function to change state of "xxchange"
})
.change(function (parall, state) {
    // Do some when each state change
});
```

### .canoe(canoeName,  canoeFunc)
function with the specified name which will not be called if canoneName is set by another, return function.
```javascript
Parall([
    function (parall) {
        setTimeout(parall.canoe('load', function () {
            // will not be called, because "load" is override by "load 2"
            console.log('-----------load 1');
        }), 2000);
    },
    function (parall) {
        // Parall.canoe same as parall.canoe
        setTimeout(Parall('load', function () {
            console.log('-----------load 2');
        }), 500);
    }
]).start();
```

### .data()
Get/Set data in current parall instance
```javascript
// set data
parall.data('param', param);
// get data
parall.data('param');
// get all data
var params = parall.data();
```

### .end()
End up parall and call final function at once.
```javascript
parall.end();
```

### .final(finalHandler)
Pushing final handler which will be invoke after call parall.end().

### .parall(handler [, param1, ..., paramN])
pushing parall handler
```javascript
Parall().parall(func1, param).parall(func2, param);
// same as
Parall([func1, func2], param);
```

### .state(stateName, stateValue)
change parall state, it will be notify state listener (use: .change('stateName', handler))

__example:__
```javascript
Parall([func1, func2, func3, ] param).start();
```
__Change in batch, using:__
```javascript
parall.state({stateName1: stateValue1, stateName2: stateValue2, ..., stateNameN: stateValueN})
```

### .start()
Start runing parall 
```javascript
Parall([func1, func2, func3, ] param).start();
```

## Change Log

[See change logs](https://github.com/switer/paralljs/blob/master/CHANGELOG.md)

## License

The MIT License (MIT)

Copyright (c) 2014 `guankaishe`

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

