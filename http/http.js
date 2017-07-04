var http = require('http');

module.exports = {
	createHTTPPage: function(mysql_module){
		http.createServer(function(request, response){ 
			mysql_module.json_page(response);
		}).listen(3000)
	}
}
