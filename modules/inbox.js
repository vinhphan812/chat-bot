const HUFLIT = require("./api/huflit"),
	api = new HUFLIT();
const CheckMessage = require("./check.message");
const { timer, message, err, info } = require("./response.data"),
	{ sendMsg, tempBtn } = require("./api/messenger"),
	{ weatherReply, today } = require("./api/weather");

let dataUser = {};

module.exports = async function checkInbox(entry) {
	const check = new CheckMessage(entry),
		sID = check.sID;

	// let res = tempBtn(err[2]);
	let res;

	console.log(`sender ${sID} ====> inbox bot`);

	try {
		if (!dataUser[sID]) dataUser[sID] = { action: "" };
		const u = dataUser[sID];

		// check action
		switch (check.check()) {
			case 1:
				u.user = check.getId();
				if (!u.user) res = err[1];
				if (!u.action) res = tempBtn(message[0]);
				break;
			case 2:
				u.today = check.test(2);
				u.action = "Schedule";
				if (!u.user) res = message[1];
				break;
			case 3:
				res = await weatherReply();
				break;
			case 4:
				u.action = "Search";
				res = message[2];
				break;
			case 5:
				res = tempBtn(message[5]);
				break;
			case 6:
				res = resInfo();
				break;
			case 7:
				res = tempBtn(message[3]);
				break;
			case 8:
				res = tempBtn(message[6]);
				break;
		}
		if (u.action && !res) return routeAction(u, sID, check.text);

		if (res) return sendMsg(sID, res);
	} catch (error) {
		console.log(error);
		sendMsg(sID, "⚠️ Có Sự Cố Rồi Hicc 😢!!!");
	}
};

function isExist(id) {
	return (
		dataUser[id].schedule && dataUser[id].user == dataUser[id].schedule.id
	);
}

async function routeAction({ user, action }, sID, text) {
	try {
		switch (action) {
			case "Schedule":
				if (!user) return sendMsg(sID, err[0]);
				await sendSchedule(sID, user);
				break;
			case "Search":
				Search(sID, text);
				dataUser[sID].action = "";
				break;
		}
	} catch (error) {
		if (!error.success) sendMsg(sID, error.msg);
		if (error.description) sendMsg(sID, error.description);
	}
}

function resInfo() {
	const makeMessage = ({ title, content }) => {
		return (
			title +
			(typeof content == "object" ? content.join("\n\t") : content)
		);
	};
	return info.map(makeMessage).join("\n\n");
}

async function Search(id, name) {
	let data = await api.searchProfessor(name),
		str = data.length + " Giảng Viên Trùng Khớp:\n\t";

	if (data.length == 0) return await sendMsg(id, err[3]);

	str += data.map(({ code, name }) => `🌟 ${code} ${name}`).join(".\n\t");

	return await sendMsg(id, str + ".\n\n" + message[4]);
}

async function sendSchedule(sID, uID) {
	try {
		if (!isExist(sID)) {
			dataUser[sID].schedule = await api.getSchedule(
				uID,
				dataUser[sID].today
			);
			dataUser[sID].schedule.id = uID;
		}
		const { success, name, data, isHaveSchedule, msg, termId } =
			dataUser[sID].schedule;

		console.log(dataUser[sID].schedule);

		if (!success) {
			dataUser[sID].user = "";
			return sendMsg(sID, msg);
		}

		dataUser[sID].action = "";

		if (!isHaveSchedule) {
			const type =
				uID.length == 10
					? "sinh viên"
					: uID.length == 5
					? "giảng viên"
					: "lớp";
			return sendMsg(
				sID,
				`⚠️ Hiện chưa có thời khóa biểu của ${type} "${name}".`
			);
		}

		await sendMsg(sID, `📅 ${termId} Schedule of ${name}\n`);
		console.log(dataUser[sID].today);
		if (dataUser[sID].today) {
			var td = today();
			const day = data[td.getDay() == 0 ? 6 : td.getDay() - 1];

			await sendMsg(sID, Sub2Text(day));
			if (day.data.length) await sendMsg(sID, await weatherReply());
			return;
		}

		for (var day of data) await sendMsg(sID, Sub2Text(day));
	} catch (error) {
		console.log(error);
		if (error.success == false) sendMsg(sID, error.msg);
	}
}

function Sub2Text({ thu, data }) {
	var str = thu.toUpperCase();
	if (data.length == 0) return str + ": Trống";
	for (const { TietHoc, MonHoc, GiaoVien, Lop, Phong } of data) {
		const [s, e] = TietHoc.split(/->|-&gt;/);
		str +=
			`\n\t📖 ${MonHoc}` +
			`\n\t🌟 ${GiaoVien || Lop}` +
			`\n\t⌛ ${timer.start(s)} > ${timer.end(e)}` +
			`\n\t🚪 ${Phong}\n`;
	}
	return str;
}
