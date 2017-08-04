var http = require('http');
var url = require('url');

module.exports = {
	getCoordinatesWidth: function(mysql_module){
		http.createServer(function (request, response) {
		
			var queryData = url.parse(request.url, true).query;
			
			response.writeHead(200, {"Content-Type": "text/plain"});
			
			if (queryData.latitude && queryData.longitude) {
				mysql_module.roads_width_page(response, queryData.latitude, queryData.longitude);
			} else {
				response.end('');
			}
		}).listen(8000);
	}
}