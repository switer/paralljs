var Parall = require('../parall.js');

Parall([
    // fetch from github.com
    function (parall, index, param) {

        console.log(param); // "switer"

        parall.state({
            'isFromGithub': true,
            'isFromGithubIO': false
        });
    },
    // fetch from github.io
    function (parall) {
        parall.state('isFromGithubIO', true);
    },
    // fetch from github.com/switer
    function (parall) {
        parall.state('isFromGithubSwiter', true);
        // states well be never change
        parall.end();
    }
], "switer")

.before(function () {
    
})
.change(function (parall, states) {
    if(states.isFromGithub && states.isFromGithubSwiter) {
        
    }
})
.change('isFromGithub', function (parall, isFromGithub) {
    
})
.done(function () {
    
});
