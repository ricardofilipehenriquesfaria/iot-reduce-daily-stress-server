var io = require('socket.io').listen(3001);

module.exports = {
	getIO: function() {
		return io;
	},
	
	startServer: function(mysql_module) {
		io.on('connection', function(socket){ 
    
			console.log('Ligação estabelecida com o cliente!');

			socket.on('message', function(event){ 
				console.log('Mensagem recebida do cliente:', event);
			});

			socket.on('device_id', function(event){ 
				var device_data = JSON.parse(event);
				mysql_module.getDeviceData(device_data);
			});
			
			socket.on('disconnect',function(){
				console.log('Ligação perdida!');
			});
		});
	}
}
	
console.log('Servidor correndo em http://127.0.0.1:3001/');