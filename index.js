var http_module = require("./http/http.js");
var mysql_module = require('./mysql/mysql.js');
var socket_io_module = require('./socket_io/socket_io.js');
var livesql_module = require('./livesql/livesql.js');

http_module.createHTTPPage(mysql_module);

socket_io_module.startServer(mysql_module);

var io = socket_io_module.getIO();
livesql_module.getChanges(io);