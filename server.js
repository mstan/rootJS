/*
    MODULES -- DECLARATION
*/
var express = require('express'),
    ejs = require('ejs');

/*
    EXECUTION AND CONFIGURATION
*/
var app = express();
var databaseConnection = require('./lib/database/helper.js').connection;

/*
    LIBRARY - USER DECLARED MODULES
*/
var routing = require('./routing.js'),
    database = require('./lib/database/mysql.js'),
    //Middleware
    heartbeat = require('./lib/middleware/heartbeat.js'),
    checkDBConnection = require('./lib/middleware/checkForDB.js'),
    //Language
    messages = require('./locale/en.js');

/*
    FUNCTION DECLARATION FOR STARTING SERVER
*/

//MASTER is a declared function we will prototype with the setup process
function MASTER() {
    var self = this;

    self.connectDB();
}

//Handle all database connections here. Then pass off to Express configuration
MASTER.prototype.connectDB = function() {
    var self = this;

    database.connectMySQL((err,connection) => {
        if(err) {
            self.stop();
        } else {
            databaseConnection = connection;

            self.configureExpress();
        }
    });
}

//Basic Express configuration. Middleware such as body-parsing will be handled here
MASTER.prototype.configureExpress = function() {
    var self = this;

    self.configureMiddleware();
}

//User declared middleware here. Page permission viewing, authentication, etc should be handled here
MASTER.prototype.configureMiddleware = function() {
    var self = this;

    //In default MySQL configurations, the system will close the pool after a period of inactivity. This is used to run a query every 6 hours to ensure it stays alive
    setInterval(() => { heartbeat.beat() } , heartbeat.interval);

    //For each request, check to see if our globally declared object for the database exists. If not, don't attempt
    app.use('/', (req,res,next) => {
        checkDBConnection.status((err,response) => {
            if(response) {
                next();
            } else {
                res.send(messages.console.dbError);
            }
        });
    });

    self.configureRouting();
}

//Route declarations here
MASTER.prototype.configureRouting = function() {
    var self = this;

    var router = express.Router(); //This is our router object to pass to REST JSON
      
    app.use('/', router);

    var restRouter = new routing(router);

    self.startServer();
}

//Bind the server to a listening port. Begin process
MASTER.prototype.startServer = function() {
    var self = this;

    app.listen(1234);
    console.log(messages.console.appIsLive);

}

//Stop server process, in case of an error (such as database not connecting)
MASTER.prototype.stop = function() {
    var self = this;

    console.log(messages.console.dbError);
    process.exit(1);
}

new MASTER();