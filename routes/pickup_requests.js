var express = require("express");
var router = express.Router();
const { verifyUserSession } = require("../middlewares/auth");
const pickupRequestsController = require("../controllers/pickup_requests");

router.get("/", verifyUserSession, pickupRequestsController.getAllRequests);
router.post("/", verifyUserSession, pickupRequestsController.raiseRequest);
router.delete(
  "/:id",
  verifyUserSession,
  pickupRequestsController.cancelRequest
);

module.exports = router;
