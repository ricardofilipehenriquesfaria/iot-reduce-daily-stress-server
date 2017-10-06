var CronJob = require('cron').CronJob;

module.exports = {
	scheduleGetFromCivilProtection: function(cheerio_module, mysql_module, nodemailer_module) {
		var job = new CronJob({cronTime: '00 00 8 * * 1-7', 
			onTick: function() {
			 	cheerio_module.getFromCivilProtection(mysql_module, nodemailer_module);	
			},
			start: false,
			timeZone: 'Europe/Lisbon'
		});
		job.start();
	},
	
	scheduleSendNotifications: function(mysql_module, firebase_module) {
		var job = new CronJob({cronTime: '00 00 20 * * 1-7', 
			onTick: function() {
			 	mysql_module.searchTomorrowClosedRoads(firebase_module);
			},
			start: false,
			timeZone: 'Europe/Lisbon'
		});
		job.start();
	}
}

