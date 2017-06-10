/*
    LICENSED BY Matthew Stanley <1379tech@gmail.com>
*/


/*
    ROUTER DEPENDENCIES
*/
var indexRouter = require('./lib/routing/index.js');

/*
    FUNCTION DECLARATION
*/
function ROUTER(router) {
    this.handleRoutes(router);
}

ROUTER.prototype.handleRoutes = function(router) {
    router.use('/index', indexRouter(router));
}

module.exports = ROUTER;