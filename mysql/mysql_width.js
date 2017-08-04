var mysql = require('mysql');

var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'roads_data',
});

module.exports = {
	roads_width_page: function(response, latitude, longitude) {
		
		var query = "SELECT * FROM bounding_boxes WHERE southLatitude <= '" + latitude
				+ "' AND northLatitude >= '" + latitude 
				+ "' AND westLongitude <= '" + longitude
				+ "' AND eastLongitude >= '" + longitude + "'";
		
		connection.query(query, function(err, results, fields) {
		
			if(results.length > 0){
				connection.query("SELECT * from funchal_roads WHERE id = '" + results[0].id_funchal_roads + "'", function(err, results, fields) {
					if(results.length > 0){
						response.writeHead(200, { 'Content-Type': 'application/json'});
						response.end(JSON.stringify(results));
						response.end();
					}
				});
			} else {
				response.end("Nenhuma estrada correspondente!");
			}
		});
	}
}
	