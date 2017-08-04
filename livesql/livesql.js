var LiveSQL = require('live-sql');
var request_module = require('./request.js');

var manager = new LiveSQL({
		  "host": "localhost",
		  "user": "zongji",
		  "password": "zongji",
		  "database": "closed_roads"
		});

manager.subscribe("closed_roads");	
	
module.exports = {
	getChanges: function(io, mysql_module){
		manager.on("*.*.*", function(event){
			
			if(event.type() == 'tablemap') return;
			
			if(event.tableName() == 'civil_protection'){
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
			}
			
			if(event.tableName() == 'temp_civil_protection'){
				if(event.type() == 'update') {
				
					for (var i = event.effected() - 1; i >= 0; i--) {

						var eventRows = JSON.stringify(event.rows());
						var json = JSON.parse(eventRows);
						var id = json[0].before.id;
						
						if (json[0].after.latitude_inicio != 1.1125369292536007e-308
							&& json[0].after.longitude_inicio != 1.1125369292536007e-308
							&& json[0].after.latitude_fim != 1.1125369292536007e-308
							&& json[0].after.longitude_fim != 1.1125369292536007e-308) {
						
							var latitude_inicio = json[0].after.latitude_inicio;
							var longitude_inicio = json[0].after.longitude_inicio;
							var latitude_fim = json[0].after.latitude_fim;
							var longitude_fim = json[0].after.longitude_fim;
							
							request_module.getLinkId(mysql_module, id, latitude_inicio, longitude_inicio, 1);
							request_module.getLinkId(mysql_module, id, latitude_fim, longitude_fim, 2);
						}
					};
				}
			}
		});
		
		manager.on("error", function(event){
			console.log(event);
			return;
		});
		
		manager.start();
	}
}
