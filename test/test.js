'use strict;'

var Parall = require('../parall.js');

Parall([
    // fetch from github.com
    function (parall, index, param) {

        console.log('parall id: ' + index, param); // 0 "switer"

        parall.state({
            'isFromGithubCom': true,
            'fromUrl': 'github.com',
        });
    },
    // fetch from github.io
    function (parall, index) {
        parall.data('params', {name:"switer"});
        console.log('parall id: ' + index); // 1
        setTimeout( function() {
            parall.state('isFromGithubIO', true);
            // states well be never change
            parall.end();
        }, 2000);
    },
    // fetch from github.com/switer
    function (parall, index) {
        console.log('parall id: ' + index); // 2
        parall.state('isFromGithubSwiter', true);
        
    }
], "switer")
.parall(function (parall, index, param) {
    console.log('parall id: ' + index, param); // 3 "guankaishe"
}, 'guankaishe')
.before(function (parall, index) {
    console.log('before parall handler ' + index)
})
.change(function (parall, states) {
    if(states.isFromGithub && states.isFromGithubSwiter) {
        
    }
})
.change('isFromGithubIO', function (parall, isFromGithubIO) {
    console.log('isFromGithubIO', isFromGithubIO);
})
.change('isFromGithubSwiter', function (parall, isFromGithubSwiter) {
    console.log('isFromGithubSwiter', isFromGithubSwiter)
})
.final(function (parall) {
    console.log('final', parall.data())
})
.start();
