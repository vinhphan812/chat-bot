const request = require("request-promise").defaults({
	resolveWithFullResponse: true,
	simple: false,
});

module.exports = {
	sendMsg: (senderId, msg) => {
		console.log(`sender ${senderId} <==== bot reply`);
		console.log(msg);
		return request({
			url: "https://graph.facebook.com/v2.6/me/messages",
			qs: {
				access_token: process.env.PAGE_ACCESS_TOKEN,
			},
			method: "POST",
			json: {
				recipient: {
					id: senderId,
				},
				message: typeof msg == "object" ? msg : { text: msg },
			},
		});
	},
	/**
	 * @typedef {Object} buttonMessage
	 * @property {Object} attachment - The attachment object.
	 * @property {String} attachment.type - The attachment type
	 * @property {Object} attachment.payload - The attachment payload
	 * @property {String} attachment.payload.template_type - The attachment template type
	 * @property {String} attachment.payload.text - The attachment text.
	 * @property {button[]} attachment.payload.buttons - The attachment buttons.
	 * @param {Object} message - data reply for sender.
	 * @param {String} message.t - message text reply.
	 * @param {String[]} message.o - message options button reply.
	 * @returns {buttonMessage} result is json data reply message.
	 */
	tempBtn: ({ t, o }) => {
		return {
			attachment: {
				type: "template",
				payload: {
					template_type: "button",
					text: t,
					buttons: pBack(o),
				},
			},
		};
	},
};
/**
 * @typedef {Object} button
 * @property {String} type - The type of button, default "postback".
 * @property {String} title - title message button reply.
 * @property {String} payload - value "DEVELOPER_DEFINED_PAYLOAD"
 * @param {String[]} options
 * @returns {button[]} button list (1 <= length <= 3)
 */
function pBack(options) {
	return options.map(function (msg) {
		return {
			type: "postback",
			title: msg,
			payload: "DEVELOPER_DEFINED_PAYLOAD",
		};
	});
}
