const fs = require("fs"),
	url = require("url"),
	path = "./modules/service.json";

module.exports = {
	makeURL: (hostname, pathname, query = {}) => {
		return url.format({
			protocol: "https",
			hostname: hostname,
			pathname: pathname,
			query: query,
		});
	},
	readData: (p = path) => {
		return new Promise(async (resolve, reject) => {
			try {
				fs.readFile(p, { encoding: "utf8" }, (err, data) => {
					if (err) return reject(err);
					resolve(JSON.parse(data));
				});
			} catch (error) {
				console.log(error);
				reject(error);
			}
		});
	},
	writeData: (data, p = path) => {
		return new Promise((resolve, reject) => {
			fs.writeFile(p, JSON.stringify(data), (err) => {
				if (err) console.log(err);
				console.log("save => " + p);
				resolve("save");
			});
		});
	},
};
