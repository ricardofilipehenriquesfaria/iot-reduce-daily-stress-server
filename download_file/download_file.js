var download = require('download-file')
 
var url = "https://www.google.com/maps/d/kml?mid=1286XqfwjxGF2JgDIrl3_gmiOouk&forcekml=1"
 
var options = {
    directory: "./index/download_file/data",
    filename: "protecao_civil.kml"
}
 
 module.exports = {
	downloadFile: function() {
		download(url, options, function(err){
		if (err) throw err
			console.log("Download de ficheiro efetuado com sucesso!")
		})
	}
}
 
