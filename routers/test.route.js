const express = require("express");
const router = express.Router();

const {
	schedule,
	searchByName,
	updateProffessor,
	attributesPage,
	updateAttributes,
} = require("../controllers/test.controller");

router.get("/schedule", schedule);
router.get("/search", searchByName);
router.get("/update-proffessor", updateProffessor);
router.route("/attributes").get(attributesPage).put(updateAttributes);

module.exports = router;
