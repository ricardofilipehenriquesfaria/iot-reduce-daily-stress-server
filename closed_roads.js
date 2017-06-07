var http = require('http');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'closed_roads',
});

console.log('Detalhes da conexão MySQL: ' + connection);

http.createServer(function(request, response) {
    
	console.log('Criando o Servidor HTTP...');
    
    connection.query('SELECT * FROM localizacao', function(err, results, fields) {
        
        console.log('Connection result error: ' + err);
		console.log('Número de Registos: ' + results.length);
		response.writeHead(200, { 'Content-Type': 'application/json'});
		response.end(JSON.stringify(results));
		response.end();

    });

}).listen(3000, "0.0.0.0");
