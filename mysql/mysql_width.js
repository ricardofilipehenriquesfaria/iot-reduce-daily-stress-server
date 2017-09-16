var mysql = require('mysql');

var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'pool8ball',
	database : 'roads_data',
	multipleStatements: true,
});

module.exports = {
	roads_width_page: function(queryData, numberParameters, callback) {
		
		var query = "";
		if(numberParameters > 1){
			for(var i = 0; i < numberParameters; i++){
				query = query + "SELECT * FROM funchal_roads WHERE id = (SELECT id FROM bounding_boxes WHERE southLatitude <= '" + queryData.latitude[i]
					+ "' AND northLatitude >= '" + queryData.latitude[i]
					+ "' AND westLongitude <= '" + queryData.longitude[i]
					+ "' AND eastLongitude >= '" + queryData.longitude[i] + "' LIMIT 1);";		
			}
		} else {
			query = query + "SELECT * FROM funchal_roads WHERE id = (SELECT id FROM bounding_boxes WHERE southLatitude <= '" + queryData.latitude
					+ "' AND northLatitude >= '" + queryData.latitude
					+ "' AND westLongitude <= '" + queryData.longitude
					+ "' AND eastLongitude >= '" + queryData.longitude + "' LIMIT 1);";	
		}
		
		connection.query(query, function(err, results, fields) {
		
			if(results.length > 0){
				
				var array = [];
				
				for(var i = 0; i < results.length; i++){
					var string = JSON.stringify(results[i]);
					string = string.replace(/[\[\]']+/g,'');
					array.push(string);
				}
				
				callback(JSON.stringify(array));
			} else {
				callback(JSON.stringify([0]));
			}
		});
	}
}
	