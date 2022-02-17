module.exports = {
	timer: {
		1: { s: "6h45", e: "7h35" },
		2: { s: "7h35", e: "8h25" },
		3: { s: "8h25", e: "9h15" },
		4: { s: "9h30", e: "10h20" },
		5: { s: "10h20", e: "11h10" },
		6: { s: "11h10", e: "12h00" },
		7: { s: "12h45", e: "13h35" },
		8: { s: "13h35", e: "14h25" },
		9: { s: "14h25", e: "15h15" },
		10: { s: "15h30", e: "16h20" },
		11: { s: "16h20", e: "17h10" },
		12: { s: "17h10", e: "18h00" },
		13: { s: "18h15", e: "19h05" },
		14: { s: "19h05", e: "19h55" },
		15: { s: "19h55", e: "20h45" },
		start: function (t) {
			return this[t].s;
		},
		end: function (t) {
			return this[t].e;
		},
	},
	message: [
		{
			t: "Bạn muốn xem tất cả các ngày trong tuần hay chỉ hôm nay:",
			o: ["Send All Schedules", "Send Schedule Today"],
		},
		"Nhập mã số sinh viên, giảng viên, lớp của bạn đi Powl sẽ giúp bạn tra cứu thời khóa biểu...!",
		"Nhập Tên Giảng Viên",
		{
			t: "Không có gì đâuuu 😊! Powl được tạo ra để phục vụ bạn mà. Xem thông tin về Powl:",
			o: ["Info"],
		},
		"💡 Tips: Dùng mã giảng viên tìm được nhập vào chat để Powl tra cứu thời khóa biểu giảng viên nhá!!!",
		{
			t: "Xin Chào 👋! Mình là Powl, mình có thể giúp bạn tra cứu TKB đó:",
			o: ["Info", "Help"],
		},
		{
			t: [
				"+ Send Schedule Today: tra cứu thời khóa biểu và thời tiết hôm nay.",
				"+ Send All Schedules: tra cứu thời khóa biểu theo tuần hiện tại.",
				"+ Search ID Professor: tìm kiếm mã giảng viên theo tền và sử dụng mã đó để tra cứu thời khóa biểu",
			].join("\n"),
			o: [
				"Send Schedule Today",
				"Send All Schedules",
				"Search ID Professor",
			],
		},
	],
	fo: ["Send Schedule Today", "Send All Schedules", "Search ID Professor"],
	err: [
		"Vui Lòng Nhập Lại Mã Số Sinh Viên, Giảng Viên.",
		"Mã số bạn vừa nhập không đúng đâu nhập lại để mình tra cứu thời khóa biểu cho :>",
		{
			t: "Powl không nhận dạng được cú pháp của bạn. Cú pháp tham khảo:",
			o: [
				"Send Schedule Today",
				"Send All Schedules",
				"Search ID Professor",
			],
		},
		"Không có giảng viên nào trùng khớp với tên bạn vừa nhập 😞!!!",
	],
	info: [
		{ title: `🤖 Info Chat Bot `, content: '"Thời Khóa Biểu HUFLIT"' },
		{ title: "✍️ Author: ", content: "Vinh Phan" },
		{ title: "👼 The server was created on ", content: "23/03/2021" },
		{ title: "⬆️ Updated: ", content: "18/02/2022" },
		{
			title: "📙 Description:\n\t",
			content: [
				"+ Dữ liệu được lấy từ trang portal.huflit.edu.vn",
				"+ Là một server API được viết bằng Javascript.",
				"+ Chạy trên môi trường Nodejs.",
				"+ Sử dụng NPM: Express, Request-Promise, Cheerio.",
				"+ Sử dụng API accuweather để lấy dữ liệu thời tiết.",
			],
		},
		{
			title: "💡 New Feature: \n\t",
			content: ["💬 Message", "🌤 Weather Q.10"],
		},
	],
};
