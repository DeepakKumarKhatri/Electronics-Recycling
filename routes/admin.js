const express = require("express");
const router = express.Router();
const { verifyUserSession } = require("../middlewares/auth");
const adminController = require("../controllers/admin");

router.get("/dashboard", verifyUserSession, adminController.getDashboardData);
router.get("/all-users", verifyUserSession, adminController.getAllUsers);
router.get("/submissions", verifyUserSession, adminController.getUsersSubmissions);
router.post("/change-status", verifyUserSession, adminController.changeStatusOfSubmission);
router.post("/decide-pickup", verifyUserSession, adminController.changeStatusOfPickUpRequest);

module.exports = router;
