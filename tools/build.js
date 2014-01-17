var fs = require('fs'),
    colors = require('colors'),
    Chain = require('chainjs'),
    step = 0;

Chain(function (chain) {
    fs.readFile('parall.js', {encoding: 'utf-8'}, function (err, data) {
        if (err) {
            chain.end({
                error: err
            });
            return;
        }
        console.log('Get paralljs content compelete!'.blue.grey);
        chain.data('content', data);
        chain.next();
    });
})
.then(function (chain, data) {
    fs.readFile('layout/cmd.js', {encoding: 'utf-8'}, function (err, data) {
        if (err) {
            chain.end({
                error: err
            });
            return;
        }
        console.log('Get paralljs cmd module layout compelete!'.blue.grey);
        chain.next(data);
    });
})
.then(function (chain, layout) {
    var content = chain.data('content');

    fs.writeFile('dist/parall.cmd.js', layout.replace('@content', content), {encoding: 'utf-8'}, function (err, data) {
        if (err) {
            chain.end({
                error: err
            });
            return;
        }
        console.log('Build paralljs cmd module success!'.green.grey);
        chain.next();
    });
})
.then(function (chain) {
    fs.readFile('layout/browser.js', {encoding: 'utf-8'}, function (err, data) {
        if (err) {
            chain.end({
                error: err
            });
            return;
        }
        console.log('Get paralljs browser module layout compelete!'.blue.grey);
        chain.next(data);
    });
})
.then(function (chain, layout) {
    var content = chain.data('content');

    fs.writeFile('dist/parall.browser.js', layout.replace('@content', content), {encoding: 'utf-8'}, function (err, data) {
        if (err) {
            chain.end({
                error: err
            });
            return;
        }
        console.log('Build paralljs browser module success!'.green.grey);
        chain.next();
    });
})
.before(function (chain) {
    step ++;
    console.log('Build step ' + step);
})
.final(function (chain, data) {
    if (data && data.error) {
        console.log(data.error);
    }
    console.log('Building compelete!');
})
.start();