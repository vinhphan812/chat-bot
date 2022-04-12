const express = require("express");
const router = express.Router();

const {
	schedule,
	searchByName,
	updateProffessor,
} = require("../controllers/test.controller");

router.get("/schedule", schedule);
router.get("/search", searchByName);
router.get("/update-proffessor", updateProffessor);

module.exports = router;
