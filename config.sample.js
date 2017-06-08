var configExports = {};

configExports.mysqlSettings = {
    connectionLimit : 100,
    multipleStatements: false,
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'database',
    charset: 'utf8mb4'
}

module.exports = configExports;