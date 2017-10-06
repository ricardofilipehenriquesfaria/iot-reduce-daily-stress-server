var gcm = require("node-gcm");

var sender = new gcm.Sender("AAAAGrFu8do:APA91bEY20qZgkfp_LxJhXObGgv4e_J8sgyfDTl5EPyKTCZ2m-yKgN_HCDSPxueRiICvNKeRQzbqFaVjAF-XlGIVYfI3s8Rpirs0S-29-DUgsLKxOKrg4F_0_u2G0TgJMrq0uSwjz9yS");

module.exports = {
	sendNotification: function(justificacao, nome_via) {
		var message = new gcm.Message({
			notification: {
				title: justificacao,
				icon: "ic_closed",
				body: nome_via
			},
		});

		var recipients = { to: "/topics/all" };

		sender.send(message, recipients, function(err, response){
			if (err) console.error(err);
			else console.log(response);
		});
	}
}