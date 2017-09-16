var http = require('http');
var url = require('url');

module.exports = {
	getCoordinatesWidth: function(mysql_module){
		http.createServer(function (request, response) {
		
			var queryData = url.parse(request.url, true).query;
			
			response.writeHead(200, {"Content-Type": "text/plain"});
			
			if(Array.isArray(queryData.latitude) && Array.isArray(queryData.longitude)){
				
				mysql_module.roads_width_page(queryData, queryData.latitude.length, function(results){
					response.writeHead(200, { 'Content-Type': 'application/json'});
					response.end(results);
					response.end();
				});
				
			} else if (queryData.latitude && queryData.longitude) {
				
				mysql_module.roads_width_page(queryData, 1, function(results){
					response.writeHead(200, { 'Content-Type': 'application/json'});
					response.end(results);
					response.end();
				});
				
			} else {
				response.end('');
			}
			
		}).listen(8000);
	}
}