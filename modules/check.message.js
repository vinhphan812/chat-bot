const regs = [
	/\d{2}dh\d{6}|\d{5}|\D{2}\d{4}/i, // mssv|gv|class
	/send all schedules|tất cả|all|tat ca/i,
	/send schedule today|hôm nay|today|hom nay/i,
	/weather|thời tiết|thoi tiet|thoitiet/i,
	/Search ID Professor/i,
	/^hi*$|hello|hey|^hi* powl$|xin chào|xin chaof|xin chao|xinchao/i,
	/info/i,
	/thank|cam on|cảm ơn|tks|thanks/i,
	/help/i,
];

module.exports = class checkMessage {
	constructor({ messaging }) {
		const [msg] = messaging;
		this.sID = msg.sender.id;
		this.text = this.getMessage(msg);
	}
	test(i) {
		return regs[i].test(this.text);
	}

	check() {
		let select = 0;

		if (this.test(0)) select = 1;
		else if (this.test(1) || this.test(2)) select = 2;
		else if (this.test(3)) select = 3;
		else if (this.test(4)) select = 4;
		else if (this.test(5)) select = 5;
		else if (this.test(6)) select = 6;
		else if (this.test(7)) select = 7;
		else if (this.test(8)) select = 8;

		return select;
	}

	getMessage({ postback, message }) {
		return postback ? postback.title : message.text;
	}

	getId() {
		return this.text.match(regs[0])[0] || "";
	}
};
