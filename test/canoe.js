var Parall = require('../parall.js');

Parall([
    function (parall) {
        setTimeout(parall.canoe('load', function () {
            console.log('-----------load 1');
        }), 2000);
    },
    function (parall) {
        setTimeout(parall.canoe('load', function () {
            console.log('-----------load 2');
        }), 500);
    },
    function (parall) {
        setTimeout(parall.canoe('load', function () {
            console.log('-----------load 3');
        }), 1000);
    },
    function (parall) {
        setTimeout(parall.canoe('fetch', function () {
            console.log('-----------fetch 1');
        }), 1000);
    }
]).start();