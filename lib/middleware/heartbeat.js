var heartbeatExports = {};

heartbeatExports.interval = 6 * 60 * 60 * 1000; // 6 hours * 60 minutes * 60 seconds * 1000 milliseconds (ms to s conversion) for six hour intervals.

heartbeatExports.beat = function() {
  var query = `SELECT CURDATE() AS CurrentDate, CURTIME() AS CurrentTime`;

  databaseConnection.query(query, function(err,response){
    if(err) {
      console.log('System failed to heartbeat');
      process.exit(1);
    } else {
      var currentDate = response[0].CurrentDate;
      var currentTime = response[0].CurrentTime;

      console.log('MySQL function is still alive ' + currentDate + ' at ' + currentTime );
    }

  });
}

module.exports = heartbeatExports;