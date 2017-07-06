var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'Gmail',
	tls:{ rejectUnauthorized: false},
	auth: {
		user: 'webmail.nodejs@gmail.com',
		pass: 'WebNodejs'
	}
});

module.exports = {
	sendEmail: function(text_email){
		var mailOptions = {
			from: 'webmail.nodejs@gmail.com',
			to: 'ricardo.faria.dj@gmail.com',
			subject: 'Base de Dados atualizada',
			text: text_email
		};

		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
	}
}