const { sendMsg } = require("./api/messenger"),
	{ readData, writeData } = require("./data"),
	{ today } = require("./api/weather");
const lover = "4475146975845474",
	firstDay = new Date("12/12/2020"),
	currentTime = today(),
	replyList = [
		"ZinZinh và Thíanh đã yêu nhau được {together} ngày rồi đó. zinzinh yêu thíanh nhiều lắm ❤️",
		"chồi chồi chúng ta đã bên nhau {together} ngày, zinzinh yêu thíanh mụt cách nồng nàn lắm á 💖",
		"Awwww đã {together} ngày zinzinh bên cạnh thíanh rồi, zinzinh vẫn mãi yêu thíanh như những ngày đầu 💖",
		"{together} ngày rồi, hôm nay zinzinh lại yêu thíanh nhiều hơn mụt chút nữa rồi...",
		"zinzinh yêu thíanh 💖 hôm nay đã là {together} ngày chungta yêu nhau rồi. Zinzinh sẽ k bỏ rơi thíanh đâuu",
		"đã {together} ngày rồi, thíanh phải thật ngoan đó nha, zinzinh sẽ mãi mãi yêu thíanh mà",
		"thíanh ngoan nha, nhớ ngủ sớm, ăn uống đầy đủ vì sức khỏe thíanh yếu, anh lo cho thíanh nên zinzinh mí nhắc thíanh cũng đc {together} ngày chúng ta bên nhau rồi",
		'cũng đã {together} ngày rồi zinzinh muốn nói là "zinzinh yêu thíanh mãi mãi không thể tách rời"',
		"Thời gian trôi nhanh thật mới đây mà đã {together} ngày zinzinh yêu thíanh rồi á, zinzinh chỉ muốn thấy thíanh cười, thấy thíanh hanhphuc thôii",
		Timer(),
	],
	path = "./modules/together.json",
	together = Math.floor(calculatorTimer() / 86400000);

module.exports = {
	together: async function () {
		const today = currentTime.getDate();
		var data = await readData(path);

		try {
			if (today != data.today) {
				const res = await sendMsg(lover, reply());

				if (res.statusCode != 200) {
					console.log(
						`%csend faild error message: \n\t\t${res.body.error.message}`,
						"color: #a22020"
					);
					return false;
				}
				data.today = today;
				writeData(data, path);
			}
			return true;
		} catch (error) {
			console.log(error);
		}
	},
	replyTogether: async () => {
		const res = await sendMsg(lover, reply());
		if (res.statusCode != 200) {
			console.log(
				`%csend faild error message: \n\t\t${res.body.error.message}`,
				"color: #a22020"
			);
			return "❌ Không thể gửi được tin nhắn !!!";
		}
		return "✅ Gửi thành công !!!";
	},
};

function reply() {
	const rand = random(replyList.length - 1);
	return replyList[rand].replace(/\{together\}/g, together);
}

function random(max, min = 0) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculatorTimer(first = firstDay, current = currentTime) {
	return current.getTime() - first.getTime();
}

function Timer() {
	let str = "",
		temp = calculatorTimer(firstDay, today()) / 1000;
	const nam = Math.floor(temp / 31104000);
	str += nam == 0 ? "" : `${nam} năm `;
	temp %= 31104000;
	str += `${Math.floor(temp / 2635200)} tháng `;
	temp %= 2635200;
	str += `${Math.floor(temp / 604800)} tuần `;
	temp %= 604800;
	str += `${Math.floor(temp / 86400)} ngày `;
	return `Mau thật đấy chúng ta đã yêu nhau được \n\t ${str} \nZinzinh sẽ mãi mãi yêu thương và bên cạnh thíanh bởi vì thíanh luôn luôn ở trong tim của zinzinh 💖`;
}
