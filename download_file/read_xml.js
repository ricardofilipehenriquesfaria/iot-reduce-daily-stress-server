var fs = require('fs'),
    path = require('path'),
    xmlReader = require('read-xml');
	
var convert = require('xml-js');
var equals = require('equals');
 
var FILE = path.join(__dirname, './data/protecao_civil.kml');
 
module.exports = {
	getFromCivilProtection: function(mysql_module, nodemailer_module){ 
		xmlReader.readXML(fs.readFileSync(FILE), function(err, data) {
			if (err) {
				console.error(err);
			}
			
			var xml = data.content;
			var result = JSON.parse(convert.xml2json(xml, {compact: true, spaces: 4}));
			
			var numero_elementos = result.kml.Document.Folder[0].Placemark.length;
			
			for(var i = 0; i < result.kml.Document.Folder[0].Placemark.length; i++){
				
				var responsabilidade = "";
				var data_encerramento = "";
				var localizacao = "";
				var estado = "";
				var justificacao = "";
				var data_reabertura = "";
				
				var nome_via = result.kml.Document.Folder[0].Placemark[i].name._text;
				if(equals(nome_via, undefined)){
					 nome_via = "vazio";
				}
				
				for(var j = 0; j < result.kml.Document.Folder[0].Placemark[i].ExtendedData.Data.length; j++){
					
					if(equals(result.kml.Document.Folder[0].Placemark[i].ExtendedData.Data[j]._attributes.name, "Data Encerramento")){
						
						data_encerramento = result.kml.Document.Folder[0].Placemark[i].ExtendedData.Data[j].value._text;
						
						if(equals(data_encerramento, undefined)){
							data_encerramento = "vazio";
						}
					}
					
					if(equals(result.kml.Document.Folder[0].Placemark[i].ExtendedData.Data[j]._attributes.name, "LocalizaÃ§Ã£o")){
						localizacao = result.kml.Document.Folder[0].Placemark[i].ExtendedData.Data[j].value._text;
						if(equals(localizacao, undefined)){
							localizacao = "vazio";
						}
					}
					
					if(equals(result.kml.Document.Folder[0].Placemark[i].ExtendedData.Data[j]._attributes.name, "Estado")){
						estado = result.kml.Document.Folder[0].Placemark[i].ExtendedData.Data[j].value._text;
						if(equals(estado, undefined)){
							estado = "vazio";
						}
					}
					
					if(equals(result.kml.Document.Folder[0].Placemark[i].ExtendedData.Data[j]._attributes.name, "JustificaÃ§Ã£o")){
						justificacao = result.kml.Document.Folder[0].Placemark[i].ExtendedData.Data[j].value._text;
						if(equals(justificacao, undefined)){
							justificacao = "vazio";
						}
					}
					
					if(equals(result.kml.Document.Folder[0].Placemark[i].ExtendedData.Data[j]._attributes.name, "Data Reabertura")){
						data_reabertura = result.kml.Document.Folder[0].Placemark[i].ExtendedData.Data[j].value._text;
						if(equals(data_reabertura, undefined)){
							data_reabertura = "vazio";
						}
					}
					
					if(equals(result.kml.Document.Folder[0].Placemark[i].ExtendedData.Data[j]._attributes.name, "Responsabilidade")){
						responsabilidade = result.kml.Document.Folder[0].Placemark[i].ExtendedData.Data[j].value._text;
						if(equals(responsabilidade, undefined)){
							responsabilidade = "vazio";
						}
					} 
				}
				mysql_module.saveFromCivilProtection("vazio", nome_via, localizacao, estado, justificacao, data_encerramento, data_reabertura, nodemailer_module, numero_elementos);
				console.log("Nome da Via: " + nome_via + "\nData de Encerramento: " + data_encerramento + "\nLocalização: " + localizacao + "\nEstado: " + estado + "\nJustificação: " + justificacao + "\nData de Reabertura: " + data_reabertura + "\nResponsabilidade: " + responsabilidade + "\n\n");
			}
		});
	}
}