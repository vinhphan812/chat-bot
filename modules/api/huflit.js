let request = require("request-promise"),
	cheerio = require("cheerio");
const { makeURL, readData, writeData } = require("../data");

const API_SERVER = "portal.huflit.edu.vn";

const regs = [
	/-Môn: |-Lớp: |-Tiết: |-Phòng: |-GV: |-Đã học: |-Nội dung: |-Đã dạy: |-Mã LHP: |-Nội dung : |-Phòng :/i,
	/(\d{2})\/(\d{2})\/(\d{4})/i,
];

class Huflit {
	constructor() {
		this.jar = request.jar();

		this.URL = [
			"/Home/DrawingStudentSchedule",
			"/Home/DrawingProfessorSchedule",
			"/Home/DrawingClassStudentSchedules_Mau2",
		];

		request = request.defaults({
			resolveWithFullResponse: true,
			simple: false,
			timeout: 25000,
			headers: {
				accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
				"upgrade-insecure-requests": 1,
				"accept-language": "vi,en-US;q=0.9,en;q=0.8",
				origin: "https://portal.huflit.edu.vn",
				"sec-ch-ua":
					'"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
				"sec-ch-ua-mobile": "?0",
				"sec-fetch-dest": "document",
				"sec-fetch-mode": "navigate",
				"sec-fetch-site": "same-origin",
				"sec-fetch-user": "?1",
				"user-agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36 Edg/84.0.522.59",
			},
		});
	}

	requestServer(d = { URI, form: "" }) {
		const url = makeURL(API_SERVER, d.URI.path, d.URI.query);
		console.log(url);
		return request({
			uri: url,
			jar: this.jar,
			method: typeof d.form == "object" ? "POST" : "GET",
			formData: d.form,
			transform: (b) => cheerio.load(b),
		}).catch((error) => error);
	}

	checkWeek() {
		const { dayEndWeek, endDay } = this.data,
			[d, mo, y] = dayEndWeek.split("/"),
			[h, mi, s] = endDay.split(":");
		const c = (e) => e.getTime() - new Date().getTime() < 0,
			f = c(new Date(y, +mo - 1, d, h, mi, s));
		if (f) {
			this.data.weekCode++;
			writeData(this.data);
		}
		return f;
	}

	login() {
		return new Promise(async (resolve, reject) => {
			try {
				if (!this.data) this.data = await readData();
				const getCookie = () =>
					this.jar.getCookieString(makeURL(API_SERVER));

				const { user, pass } = process.env;

				const $ = await this.requestServer({
						URI: { path: "/Login" },
						form: {
							txtTaiKhoan: user,
							txtMatKhau: pass,
						},
					}),
					title = $("title").text();
				console.log(title);
				if (
					title != "Object moved" &&
					title != "Cổng thông tin đào tạo"
				)
					return resolve({
						success: false,
						msg: "⚠️ Server trường không khả dụng!!!",
					});

				this.data.cookie = getCookie();
				writeData(this.data);

				resolve({ success: true });
			} catch (e) {
				console.log(e);
				reject({ success: false, msg: "⚠️ lỗi đăng nhập" });
			}
		});
	}

	CheckCookie() {
		return new Promise(async (resolve, reject) => {
			try {
				if (!this.data) this.data = await readData();

				const { cookie } = this.data;

				if (cookie) {
					this.jar.setCookie(cookie, "https://" + API_SERVER);

					const $ = await this.requestServer({
						URI: { path: "/Home" },
					});

					if ($.error && !$.error.connect)
						return reject({
							success: false,
							msg: "⚠️ Server trường quá tải, vui lòng thử lại sau!!!",
						});

					const user = $("a.stylecolor span").text();

					if (user) return resolve({ success: true });
				}

				resolve(await this.login());
			} catch (e) {
				console.log(e.code);
				if (!e.success) return reject(e);
				reject({ success: false, msg: "⚠️ check cookie error" });
			}
		});
	}

	getSchedule(id = "") {
		return new Promise(async (resolve, reject) => {
			if (id == "") reject({ success: false, msg: "⚠️ ID is Null." });
			extractData = extractData.bind(this);
			let f, $;
			try {
				const check = await this.CheckCookie();

				if (!check.success) return resolve(check);

				f = await this.checkWeek();
				const { year, termId, weekCode } = this.data;

				let p = {
						StudentId: id,
						YearId: year,
						TermId: termId,
						WeekId: weekCode,
						YearStudy: year,
						Week: weekCode,
					},
					t = 0;
				if (id.length < 7) {
					p[isType(id)] = id;
					t = id.length == 5 ? 1 : 2;
				}

				$ = await this.requestServer({
					URI: { path: this.URL[t], query: p },
				});
				const r = [];
				console.log($.error && !$.error.connect);
				if ($.error && !$.error.connect)
					return reject({
						success: false,
						msg: "⚠️ Server trường quá tải, vui lòng thử lại sau!!!",
					});

				const name = getText($("span")[1], ":")[1],
					d = $("tr:not(:first-child)");

				// ? Check user valid
				if (!name) {
					const msg =
						id.length == 5
							? "⚠️ Không Tồn Tại Giảng Viên Này...!"
							: "⚠️ Không Tồn Tại Sinh Viên Này...!";
					resolve({
						success: false,
						msg: msg,
					});
				}

				var isHaveSchedule = false;
				await d.each(async (i, e) => {
					const data = await extractData(i, e);
					if (data.data.length > 0) isHaveSchedule = true;
					r.push(data);
				});
				resolve({
					success: true,
					resData: r,
					name: name.replace("  ", " "),
					isHaveSchedule: isHaveSchedule,
					termId: termId,
				});
			} catch (error) {
				console.log("log" + error);
				if (!error.success) return reject(error);
				reject({ success: false, msg: "⚠️ server error" });
			}
			async function extractData(i, e) {
				let els = $(e).children(),
					res = {
						thu: getText(els[0], "(")[0].trim(),
						data: [],
					};

				if (f && checkUpdate(i, id)) {
					this.data.dayEndWeek = $(els[0])
						.text()
						.match(regs[1])[0];
					await writeData(this.data);
				}

				els.each(function (j, el) {
					if (j == 0) return;

					if (id.length == 5) {
						if ($(el).children().length < 7) return;

						var s = $(el).html().trim().split("<hr>");

						for (var i = 0; i < s.length; i++) {
							var ex = s[i]
								.replace(/<br>/g, "")
								.split(regs[0]);
							res.data.push(new SubjectP(ex));
						}
					} else {
						$(el)
							.find("div")
							.each((i, e) =>
								res.data.push(
									new SubjectS(getText(e, regs[0]))
								)
							);
					}
				});
				return res;
			}

			function checkUpdate(day, id) {
				return day == 6 && id.length == 10;
			}

			function SubjectP(val) {
				this.MonHoc = val[1].split(" (")[0].replace("amp;", "");
				this.LHP = val[2];
				this.Lop = val[3];
				this.TietHoc = val[4];
				this.DaDay = val[5];
				this.Phong = val[6];
				this.NoiDung = val[7];
			}
			function SubjectS(val) {
				this.MonHoc = val[1].split("(")[0];
				this.Lop = val[2];
				this.TietHoc = val[3];
				this.Phong = val[4];
				this.GiaoVien = val[5];
				this.DaHoc = val[6];
				this.NoiDung = val[7];
			}
			function getText(el, reg) {
				return $(el).text().split(reg);
			}
			function isType(id) {
				return id.length == 5 ? "ProfessorID" : "ClassStudentID";
			}
		});
	}

	getListProfessor() {
		return new Promise(async (resolve, reject) => {
			var $ = await this.requestServer({
				URI: { path: "/Home/GetProfessorByTerm/2020-2021$HK02" },
			});
			var data = JSON.parse($("body").text());
			data = data.map(({ ProfessorID: code, ProfessorName: n }) => {
				return {
					code,
					name: n.split(", ")[1].split("  ").join(" "),
				};
			});
			this.data.ProfessorList = data;
			writeData(this.data);
			resolve(true);
		});
	}

	searchProfessor(name) {
		return new Promise(async (resolve, reject) => {
			try {
				name = name.toLowerCase();
				if (!this.data) this.data = await readData();

				resolve(this.data.ProfessorList.filter(check));

				function check(item) {
					const pName = item.name.toLowerCase();
					if (pName.indexOf(name) >= 0 || checkDetail(pName))
						return item;
				}

				function checkDetail(item) {
					return item.split(" ").find((i) => i == name);
				}
			} catch (error) {
				console.log(error);
				reject(error);
			}
		});
	}
}

module.exports = Huflit;
