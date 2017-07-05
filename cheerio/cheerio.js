var request = require('request');
var cheerio = require("cheerio");

module.exports = {
	getFromCivilProtection: function(mysql_module) {
		request('https://www.procivmadeira.pt/pt/informacao-a-populacao.html', function (error, response, html) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(html);
				$('iframe').each(function(index, element){
					var url = $(element).attr('src');
					createNewRequest(url, mysql_module);
				});
			}
		});
	}
}
	
function createNewRequest(url, mysql_module){
	request(url, function (error, response, html) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
			var previous_index = 0;
			var concelho = "";
			var data_encerramento = "";
			var nome_via = "";
			var localizacao = "";
			var estado = "";
			var justificacao = "";
			var data_reabertura = "";
			$('tr td').not( '.freezebar-cell').not('.s0').each(function(index, element) {
				
				if (previous_index == 0) {
					concelho = $(element).text();
					previous_index++;
				} else if (previous_index == 1) {
					data_encerramento = $(element).text();
					previous_index++;
				} else if (previous_index == 2) {
					nome_via = $(element).text();
					previous_index++;
				} else if (previous_index == 3) {
					localizacao = $(element).text();
					previous_index++;
				} else if (previous_index == 4) {
					estado = $(element).text();
					previous_index++;
				} else if (previous_index == 5) {
					justificacao = $(element).text();
					previous_index++;
				} else if (previous_index == 6) {
					data_reabertura = $(element).text();
					previous_index++;
				} else if (previous_index == 7) {
					previous_index++;
				} else if (previous_index == 8) {
					var write = "INSERT INTO temp_civil_protection (concelho, nome_via, localizacao, estado, justificacao, data_encerramento, data_reabertura) VALUES ('" 
						+ concelho 
						+ "','" + nome_via
						+ "','" + localizacao
						+ "','" + estado
						+ "','" + justificacao
						+ "','" + data_encerramento
						+ "','" + data_reabertura + "')";
						previous_index = 0;
						
					mysql_module.saveFromCivilProtection(write);
				}	
			});
		}
	});
}
