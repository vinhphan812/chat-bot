const checkInbox = require("../modules/inbox");

module.exports = {
	verify: function (req, res) {
		console.log(req.query);
		if (req.query["hub.verify_token"] === process.env.VALIDATION_TOKEN)
			return res.send(req.query["hub.challenge"]);
		res.status(302).send("Error, wrong validation token");
	},
	chat: async function (req, res) {
		try {
			checkInbox(req.body.entry[0]);
			res.status(200).send("OK");
		} catch (err) {
			console.log(err);
			res.status(500).send("err");
		}
	},
};
