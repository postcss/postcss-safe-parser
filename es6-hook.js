var path = require('path');

var end = path.join('node_modules', 'postcss');
if ( __dirname.slice(-end.length) !== end ) return;

var babel = require('babel-core');
var fs    = require('fs');

fs.readdir(path.join(__dirname, 'lib'), function (err, files) {
    if ( err ) throw err;

    files.forEach(function (i) {
        if ( !/\.es6$/.test(i) ) return;

        var file = path.join(__dirname, 'lib', i);
        babel.transformFile(file, function (err2, result) {
            if ( err2 ) throw err2;

            var js = file.replace(/\.es6$/, '.js');
            fs.writeFile(js, result.code, function (err3) {
                console.log('postcss/lib/' + i +
                    ' -> postcss/lib/' + i.replace(/\.es6$/, '.js'));
                if ( err3 ) throw err3;
            });
        });
    });
});
