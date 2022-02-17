require("dotenv").config();

const http = require("http"),
	express = require("express"),
	path = require("path");

const { verify, chat } = require("./Controller/webhook.controller");

const app = express();

app.use(express.json());
app.use(
	express.urlencoded({
		extended: false,
	})
);

app.use(express.static(path.join(__dirname, "public")));
const server = http.createServer(app);

app.get("/", (req, res) =>
	res.send("Hook messenger Bot Thời Khóa Biểu HUFLIT")
);
app.get("/webhook", verify);
app.post("/webhook", chat);

app.set("port", process.env.PORT || 5000);
app.set("ip", process.env.IP || "0.0.0.0");

server.listen(app.get("port"), app.get("ip"), function () {
	console.log(
		"Chat bot server listening at %s:%d ",
		app.get("ip"),
		app.get("port")
	);
});
