const express = require("express");
const router = express.Router();
const { verifyUserSession } = require("../middlewares/auth");
const dashboardController = require("../controllers/dashboard");

router.get("/", verifyUserSession, dashboardController.getDashboardData);

module.exports = router;
