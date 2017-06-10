var envParameters = {
    port: process.argv[2],
    locale: process.argv[3]
}

/*
    MODULES -- DECLARATION
*/
var express = require('express'),
    ejs = require('ejs');
/*
    EXECUTION AND CONFIGURATION
*/
var app = express();
var databaseConnection = require('./lib/database/helper.js');
/*
    LIBRARY - USER DECLARED MODULES
*/
var routing = require('./routing.js'),
    database = require('./lib/database/mysql.js'),
    //Middleware
    heartbeat = require('./lib/middleware/heartbeat.js'),
    checkForDB = require('./lib/middleware/checkForDB.js'),
    //Language
    messages = require('./locale/helper.js')({ language: envParameters.locale }); //Pass our environment language. If it doesn't exist -- return english
/*
    FUNCTION DECLARATION FOR STARTING SERVER
*/

//MASTER is a declared function we will prototype with the setup process
function MASTER() {
    this.connectDB();
}

//Handle all database connections here. Then pass off to Express configuration
MASTER.prototype.connectDB = function() {
    database.connectMySQL((err,connection) => {
        if(err) {
            this.stop();
        } else {
            databaseConnection = connection;

            this.configureExpress();
        }
    });
}

//Basic Express configuration. Middleware such as body-parsing will be handled here
MASTER.prototype.configureExpress = function() {

    this.configureMiddleware();
}

//User declared middleware here. Page permission viewing, authentication, etc should be handled here
MASTER.prototype.configureMiddleware = function() {
    //In default MySQL configurations, the system will close the pool after a period of inactivity. This is used to run a query every 6 hours to ensure it stays alive
    setInterval(() => { heartbeat.beat() } , heartbeat.interval);

    //For each request, check to see if our globally declared object for the database exists. If not, don't attempt
    app.use('/', (req,res,next) => {
        checkForDB.status( (err,response) => {
            if(response) {
                next();
            } else {
                res.send(messages.dbError);
            }
        });
    });

    this.configureRouting();
}

//Route declarations here
MASTER.prototype.configureRouting = function() {
    var router = express.Router(); //This is our router object to pass to REST JSON
      
    app.use('/', router);
    var restRouter = new routing(router);

    this.startServer();
}

//Bind the server to a listening port. Begin process
MASTER.prototype.startServer = function() {
    var port = envParameters.port || 1234;

    app.listen(port);
    console.log(messages.appIsLive);
    console.log('Listening at port ' + port);
}

//Stop server process, in case of an error (such as database not connecting)
MASTER.prototype.stop = function() {
    console.log(messages.dbError);
    process.exit(1);
}

new MASTER();