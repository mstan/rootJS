var fs = require('fs');
var helperExports = {}

function returnLocale(parameters) {
    var locale = parameters.language; 

    var checkIfLocaleExists = fs.existsSync(__dirname + '/' + locale + '.js');

        if(checkIfLocaleExists) {
            return require('./' + locale + '.js');
        } else {
            return require('./en.js');
        }
}

module.exports = returnLocale;