/* eslint-disable no-var */

var path = require('path');

var escape = function (str) {
    return str.replace(/[\[\]\/{}()*+?.\\^$|-]/g, '\\$&');
};

var regexp = ['lib', 'test', 'node_modules/postcss/lib'].map(function (i) {
    return '^' + escape(path.join(__dirname, i) + path.sep);
}).join('|');

require('babel-core/register')({
    only:   new RegExp('(' + regexp + ')'),
    ignore: false
});
module.exports = require('./lib/safe-parse');
