const HUFLIT = require("../modules/api/huflit");
const { readData, writeData } = require("../modules/data");

module.exports = {
	schedule: async (req, res, next) => {
		try {
			const { id } = req.query;
			if (!id) throw new Error("ID_IS_EMPTY");

			const huflit = new HUFLIT();

			const data = await huflit.getSchedule(id);
			res.json(data);
		} catch (error) {
			res.json({
				success: false,
				message: error.message || error.msg,
			});
		}
	},
	searchByName: async (req, res, next) => {
		try {
			const { q } = req.query;
			if (!q) throw new Error("QUERY_SEARCH_IS_EMPTY");

			const huflit = new HUFLIT();

			const data = await huflit.searchProfessor(q);
			res.json({ success: true, data });
		} catch ({ message }) {
			res.json({ success: false, message });
		}
	},
	updateProffessor: async (req, res, next) => {
		try {
			const huflit = new HUFLIT();

			await huflit.CheckCookie();

			const { success, data } = await huflit.getListProfessor();

			res.json({
				success,
				...(success ? { data } : { message: "error" }),
			});
		} catch ({ message }) {
			res.json({ success: false, message });
		}
	},
	attributesPage: async (req, res, next) => {
		const { cookie, ...data } = await readData();
		res.json(data);
	},
	updateAttributes: async (req, res, next) => {
		const { termId, year, weekCode } = req.body;

		const data = await readData();

		if (termId) data.termId = termId;
		if (year) data.year = year;
		if (weekCode) data.weekCode = weekCode;

		await writeData(data);

		const { cookie, ...resData } = data;
		res.json(resData);
	},
};
