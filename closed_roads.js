var http = require('http');
var mysql = require('mysql');
var io = require('socket.io');
var LiveSQL = require('live-sql');

var manager = new LiveSQL({
  "host": "localhost",
  "user": "zongji",
  "password": "zongji",
  "database": "closed_roads"
});

manager.subscribe("closed_roads");

manager.on("*.*.*", function(event){
    
	if(event.type() == 'tablemap') return;
	
    if(event.type() == 'update') {
        
		for (var i = event.effected() - 1; i >= 0; i--) {

			var eventRows = JSON.stringify(event.rows());
			var json = JSON.parse(eventRows);
			var id = json[0].before.id;
		
			var eventDiff = JSON.stringify(event.diff(i));
			var updatedChanges = eventDiff.replace( /[{}]/g, '' );
		
			var data = `{"type":"update","id":${id},${updatedChanges}}`;
			socket.emit(data);
			console.log(data);
        };
    }
	
	if(event.type() == 'delete') {
        
		for (var i = event.effected() - 1; i >= 0; i--) {

			var eventRows = JSON.stringify(event.rows());
			var json = JSON.parse(eventRows);
			var id = json[0].id;
		
			var data = `{"type":"delete","id":${id}}`;	 
			socket.emit(data);
			console.log(data);
        };
    }
	
	if(event.type() == 'write') {
        
		for (var i = event.effected() - 1; i >= 0; i--) {

			var eventRowsArray = event.rows();
			var eventRows = eventRowsArray[0];
			var jsonString = JSON.stringify(eventRows);
			var insertedChanges = jsonString.replace( /[{}]/g, '' );

		    var data = `{"type":"insert",${insertedChanges}}`;
			socket.emit(data);
			console.log(data);
         };
    }
});

manager.start();

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