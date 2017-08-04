var http = require('http');
var url = require('url');

var server = http.createServer(function (request, response) {
	
	var queryData = url.parse(request.url, true).query;
	
	response.writeHead(200, {"Content-Type": "text/plain"});

	if (queryData.latitude && queryData.longitude) {
		response.end('Latitude = ' + queryData.latitude + ', Longitude = ' + queryData.longitude + '\n');
	} else {
		response.end('');
	}
});

server.listen(8000);