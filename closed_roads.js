var http = require('http');
var mysql = require('mysql');
var io = require('socket.io');

var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'closed_roads',
});

var server = http.createServer(function(request, response){ 
    
	connection.query('SELECT * FROM localizacao', function(err, results, fields) {
        
		console.log('Número de Registos: ' + results.length);
		
		response.writeHead(200, { 'Content-Type': 'application/json'});
		response.end(JSON.stringify(results));
		response.end();

    });
}).listen(3000);


var socket = io.listen(server);

socket.on('connection', function(client){ 
    
	console.log('Ligação estabelecida com o cliente!');

    client.on('message', function(event){ 
        console.log('Mensagem recebida do cliente:', event);
    });

    client.on('disconnect',function(){
        console.log('Ligação perdida!');
    });
});

console.log('Servidor correndo em http://127.0.0.1:3000/');