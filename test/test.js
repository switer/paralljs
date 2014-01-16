var Parall = require('../parall.js');

Parall([
    // fetch from github.com
    function (parall, index, param) {

        console.log(index, param); // 0 "switer"

        // parall.state({
        //     'isFromGithub': true,
        //     'isFromGithubIO': false
        // });
    },
    // fetch from github.io
    function (parall, index) {
         console.log(index); // 1
        parall.state('isFromGithubIO', true);
    },
    // fetch from github.com/switer
    function (parall, index) {
         console.log(index); // 2
        parall.state('isFromGithubSwiter', true);
        // states well be never change
        parall.end();
    }
], "switer")

.before(function () {
    
})
.change(function (parall, states) {
    console.log('all', states)
    if(states.isFromGithub && states.isFromGithubSwiter) {
        
    }
})
.change('isFromGithubSwiter', function (parall, isFromGithubSwiter) {
    console.log('isFromGithubSwiter', isFromGithubSwiter)
})
.done(function () {
    
})
.start();
