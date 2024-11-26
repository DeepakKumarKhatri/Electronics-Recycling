const express = require("express");
const router = express.Router();
const { verifyUserSession } = require("../middlewares/auth");
const rewardsController = require("../controllers/rewards");

router.get("/", verifyUserSession, rewardsController.getRewards);
router.get("/user-points", verifyUserSession, rewardsController.getUserPoints);
router.post("/redeem", verifyUserSession, rewardsController.redeemReward);

module.exports = router;
