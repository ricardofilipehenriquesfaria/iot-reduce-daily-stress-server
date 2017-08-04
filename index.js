var http_module = require('./http/http.js');
var mysql_module = require('./mysql/mysql.js');
var socket_io_module = require('./socket_io/socket_io.js');
var livesql_module = require('./livesql/livesql.js');
var cheerio_module = require('./cheerio/cheerio.js');
var nodemailer_module = require('./nodemailer/nodemailer.js');
var cron_module = require('./cron/cron.js');
var url_module = require('./url/url.js');

http_module.createHTTPPage(mysql_module);
socket_io_module.startServer(mysql_module);
cron_module.scheduleGetFromCivilProtection(cheerio_module, mysql_module, nodemailer_module);

var io = socket_io_module.getIO();
livesql_module.getChanges(io, mysql_module);