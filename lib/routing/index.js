/*
    LICENSED BY Matthew Stanley <1379tech@gmail.com>
*/
module.exports = function(router) {

    router.get('/', function(req,res) {
        res.render('index/index.ejs');
    });

    return router;
}