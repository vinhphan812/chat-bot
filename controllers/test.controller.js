const HUFLIT = require("../modules/api/huflit");

const huflit = new HUFLIT();

module.exports = {
	schedule: async (req, res, next) => {
		try {
			const { id } = req.query;
			if (!id) throw new Error("ID_IS_EMPTY");

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
			const data = await huflit.searchProfessor(q);
			res.json({ success: true, data });
		} catch ({ message }) {
			res.json({ success: false, message });
		}
	},
};
