const express = require("express");
const router = express.Router();
const { verifyUserSession } = require("../middlewares/auth");
const searchController = require("../controllers/search");

router.get("/", verifyUserSession, searchController.searchRecycleItems);

module.exports = router;
