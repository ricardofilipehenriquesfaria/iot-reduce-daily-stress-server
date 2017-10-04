var gcm = require("node-gcm");

var sender = new gcm.Sender("");

var message = new gcm.Message({
    notification: {
        title: "Title!",
		icon: "ic_closed",
        body: "Body!"
    },
});

var recipients = { to: "/topics/all" };

sender.send(message, recipients, function(err, response){
    if (err) console.error(err);
    else console.log(response);
});