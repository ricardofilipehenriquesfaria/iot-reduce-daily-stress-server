var LiveSQL = require('live-sql');

var manager = new LiveSQL({
		  "host": "localhost",
		  "user": "zongji",
		  "password": "zongji",
		  "database": "closed_roads"
		});

manager.subscribe("closed_roads");	
	
module.exports = {
	getChanges: function(io){
		manager.on("*.*.*", function(event){
			
			if(event.type() == 'tablemap' || event.tableName() != 'civil_protection') return;
			
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
	}
}
