var CronJob = require('cron').CronJob;

module.exports = {
	scheduleGetFromCivilProtection: function(read_xml_module, mysql_module, nodemailer_module) {
		var job = new CronJob({cronTime: '00 05 19 * * 0-6', 
			onTick: function() {
			 	read_xml_module.getFromCivilProtection(mysql_module, nodemailer_module);	
			},
			start: false,
			timeZone: 'Europe/Lisbon'
		});
		job.start();
	},
	
	scheduleSendNotifications: function(mysql_module, firebase_module) {
		var job = new CronJob({cronTime: '00 00 20 * * 0-6', 
			onTick: function() {
			 	mysql_module.searchTomorrowClosedRoads(firebase_module);
			},
			start: false,
			timeZone: 'Europe/Lisbon'
		});
		job.start();
	},
	
	scheduleDownloadFile: function(download_file_module) {
		var job = new CronJob({cronTime: '00 00 19 * * 0-6', 
			onTick: function() {
			 	download_file_module.downloadFile();
			},
			start: false,
			timeZone: 'Europe/Lisbon'
		});
		job.start();
	}
}

