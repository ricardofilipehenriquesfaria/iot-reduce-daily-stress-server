var http = require('http');
var mysql = require('mysql');
var io = require('socket.io').listen(3001);
var LiveSQL = require('live-sql');
var moment = require('moment');

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
		
			var data = `{"id":${id},${updatedChanges}}`;
			io.sockets.emit('update', data);
			console.log(data);
        };
    }
	
	if(event.type() == 'delete') {
        
		for (var i = event.effected() - 1; i >= 0; i--) {

			var eventRows = JSON.stringify(event.rows());
			var json = JSON.parse(eventRows);
			var id = json[0].id;
		
			var data = `{"id":${id}}`;	 
			io.sockets.emit('delete', data);
			console.log(data);
        };
    }
	
	if(event.type() == 'write') {
        
		for (var i = event.effected() - 1; i >= 0; i--) {

			var eventRowsArray = event.rows();
			var eventRows = eventRowsArray[0];
			var jsonString = JSON.stringify(eventRows);
			var insertedChanges = jsonString.replace( /[{}]/g, '' );

		    var data = `{${insertedChanges}}`;
			io.sockets.emit('write', data);
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

io.on('connection', function(socket){ 
    
	console.log('Ligação estabelecida com o cliente!');

    socket.on('message', function(event){ 
        console.log('Mensagem recebida do cliente:', event);
    });

	socket.on('device_id', function(event){ 
	
		var device_data = JSON.parse(event);
		
		var query = "SELECT * FROM android_device WHERE manufacturer='" + device_data.manufacturer 
			+ "' AND model='" + device_data.model
			+ "' AND serial='" + device_data.serial + "'";
			
		console.log(query);
			
		connection.query(query, function(err, results, fields) {
			
			if(results.length == 0){
				
				var write = "INSERT INTO android_device (manufacturer, model, serial) VALUES ('" + device_data.manufacturer 
					+ "','" + device_data.model
					+ "','" + device_data.serial + "')";
				
				console.log(write);
				
				connection.query(write, function(err, results, fields) {
					console.log("Novo dispositivo: " + results.insertId);
				});
			} else {
				
				for (var i in results) {
					
					var device_id = results[i];
					var lastAccess = "SELECT timestamp from android_device WHERE id=" + device_id.id + "";
					
					connection.query(lastAccess, function(err, results, fields) {
							
						var lastTimestamp = results[0];
						var timestamp = new Date(lastTimestamp.timestamp);
						timestamp = moment(timestamp).local().format('YYYY-MM-DD HH:mm:ss');
						
						var selectEntries = "SELECT * from localizacao WHERE timestamp>'" + timestamp + "'";
						
						connection.query(selectEntries, function(err, lastResults, fields) {
							for (var i in lastResults) {
								
								var changes = JSON.stringify(lastResults[i]);
								console.log(changes);
								
								var selectedChanges = changes.replace( /[{}]/g, '' );
								var data = `{${selectedChanges}}`;
								io.sockets.emit('query',data);
							};
						});
					});
					
					var now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
					
					var update = "UPDATE android_device SET timestamp='" + now + "' WHERE id=" + device_id.id + "";
					
					console.log(update);
					
					connection.query(update, function(err, results, fields) {
						console.log("Timestamp atualizado");
					});
				}
			}
		});
    });
	
    socket.on('disconnect',function(){
        console.log('Ligação perdida!');
    });
});

console.log('Servidor correndo em http://127.0.0.1:3001/');