var mysql = require('mysql');
var moment = require('moment');

var text_mail = "";

var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'pool8ball',
	database : 'closed_roads',
});

module.exports = {
	json_page: function(response) {
		connection.query("SELECT * from civil_protection WHERE (data_reabertura>='" + moment().format('YYYY-MM-DD') + "' ORDER BY id", function(err, results, fields) {
			
			if (err) {
				console.log(err);
			} else {
				console.log('Número de Registos: ' + results.length);
				
				response.writeHead(200, { 'Content-Type': 'application/json'});
				response.end(JSON.stringify(results));
				response.end();
			}
		});
	},
	
	getDeviceData: function(device_data){
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
						
						var selectEntries = "SELECT * from localizacao WHERE (timestamp >'" + timestamp + "' AND data_reabertura>='" + moment().format('YYYY-MM-DD') + "' AND STR_TO_DATE(data_encerramento, '%Y-%m-%d') IS NOT NULL AND STR_TO_DATE(hora_encerramento, '%H:%i:%s') IS NOT NULL AND STR_TO_DATE(hora_reabertura, '%H:%i:%s') IS NOT NULL) ORDER BY id";
						
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
										
					var update = "UPDATE android_device SET timestamp='" + moment().format('YYYY-MM-DD HH:mm:ss') + "' WHERE id=" + device_id.id + "";
					
					console.log(update);
					
					connection.query(update, function(err, results, fields) {
						console.log("Timestamp atualizado");
					});
				}
			}
		});
	},
	
	saveFromCivilProtection: function(concelho, nome_via, localizacao, estado, justificacao, data_encerramento, data_reabertura, nodemailer_module, numero_elementos){
		
		var query = "SELECT * FROM temp_civil_protection WHERE "
						+ "concelho='" + concelho 
						+ "' AND nome_via='" + nome_via
						+ "' AND localizacao='" + localizacao
						+ "' AND estado='" + estado
						+ "' AND justificacao='" + justificacao
						+ "' AND data_encerramento='" + data_encerramento
						+ "' AND data_reabertura='" + data_reabertura + "'";

		connection.query(query, function(err, results, fields) { 
        	if(results.length <= 0){
        		var write = "INSERT INTO temp_civil_protection (concelho, nome_via, localizacao, estado, justificacao, data_encerramento, data_reabertura) VALUES ('" 
								+ concelho 
								+ "','" + nome_via
								+ "','" + localizacao
								+ "','" + estado
								+ "','" + justificacao
								+ "','" + data_encerramento
								+ "','" + data_reabertura + "')";
        		connection.query(write, function(err, results, fields) {
					text_mail += "Novo registo inserido na base de dados: " + results.insertId + "\n";
					if (numero_elementos == 0){
					nodemailer_module.sendEmail(text_mail);
					}
        		});  
			}
		});
	},
	
	insertLinkIdInicio: function(id, linkid_inicio){
		
		var write = "UPDATE temp_civil_protection SET linkid_inicio=" 
						+ linkid_inicio + " WHERE id=" + id;
		connection.query(write, function(err, results, fields) {
			console.log("Link de Inicio atualizado");
		});  
	},

	insertLinkIdFim: function(id, linkid_fim){
		
		var write = "UPDATE temp_civil_protection SET linkid_fim=" 
						+ linkid_fim + " WHERE id=" + id;
		connection.query(write, function(err, results, fields) {
			console.log("Link de Fim atualizado");
		});  
	}
}
	