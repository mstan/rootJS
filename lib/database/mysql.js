var mysql = require('mysql'),
    mysqlExports = {}; //An object to export that contains everything we will need related to mysql

var config = require('../../config.js');

mysqlExports.connectMySQL = function (cb) {
    var pool = mysql.createPool(config.mysqlSettings);

    pool.getConnection( function(err,connection) {
      if(err) {
          cb(err,null);
      } else {
          cb(null,connection);
      }
    });
}




module.exports = mysqlExports;