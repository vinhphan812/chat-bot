const express = require("express");
const router = express.Router();

const { schedule, searchByName } = require("../controllers/test.controller");

router.get("/schedule", schedule);
router.get("/search", searchByName);

module.exports = router;
