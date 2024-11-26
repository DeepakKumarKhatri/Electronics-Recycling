const express = require("express");
const router = express.Router();
const { verifyUserSession } = require("../middlewares/auth");
const recycleHistoryController = require("../controllers/recycleHistory");

router.get("/", verifyUserSession, recycleHistoryController.getRecycleHistory);

module.exports = router;