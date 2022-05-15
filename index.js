require("dotenv").config();

const http = require("http"),
	express = require("express"),
	path = require("path"),
	https = require("https"),
	fs = require("fs");

const testRoute = require("./routers/test.route");
const { verify, chat } = require("./controllers/webhook.controller");

const key = fs.readFileSync("./key.pem");
const cert = fs.readFileSync("./cert.pem");

const credentials = { key, cert };

const app = express();

app.use(express.json());
app.use(
	express.urlencoded({
		extended: false,
	})
);

app.use("/test", testRoute);

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "./index.html")));
app.get("/webhook", verify);
app.post("/webhook", chat);

app.set("port", process.env.PORT || 80);
app.set("ip", process.env.IP || "0.0.0.0");

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

// httpServer.listen(app.get("port"), app.get("ip"), function () {
// 	console.log(
// 		"Chat bot server listening at %s:%d ",
// 		app.get("ip"),
// 		app.get("port")
// 	);
// });

httpsServer.listen(app.get("port"), app.get("ip"), function () {
	console.log(
		"Chat bot server listening at %s:%d ",
		app.get("ip"),
		app.get("port")
	);
});
