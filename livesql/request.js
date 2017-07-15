var request = require('request');

module.exports = {
	getLinkId: function(mysql_module, id, latitude, longitude, i){
		
		var url_api = "http://open.mapquestapi.com/directions/v2/findlinkid?key=hUuNdwLPB9fzsW1N1Zh5XeeWpqAYEqrU&lat=" + latitude + "&lng=" + longitude + "";
		
		request({url: url_api, json: true}, function (err, res, json){
			if (err) {
				throw err;
			}
			if(i == 1){
				mysql_module.insertLinkIdInicio(id, json.linkId);
			} else if (i == 2){
				mysql_module.insertLinkIdFim(id, json.linkId);
			}
		})
	}
}