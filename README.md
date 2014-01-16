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
        setTimeout( function() {
            console.log(index); // 2
        }, 1000);
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

### Parall(beginHandlers, [param1], [param2], [paramN]);
Instancing a parall intance and push parall functions with param which will be invoke when call parall.start() 
```javascript
Parall([
    func1,
    func2,
    func3
], param);
```