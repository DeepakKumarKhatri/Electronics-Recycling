const express = require("express");
const router = express.Router();
const { verifyUserSession } = require("../middlewares/auth");
const adminController = require("../controllers/admin");
const upload = require("../middlewares/multer");

router.get("/dashboard", verifyUserSession, adminController.getDashboardData);
router.get("/all-users", verifyUserSession, adminController.getAllUsers);
router.get("/submissions", verifyUserSession, adminController.getUsersSubmissions);
router.post("/change-status", verifyUserSession, adminController.changeStatusOfSubmission);
router.post("/decide-pickup", verifyUserSession, adminController.changeStatusOfPickUpRequest);
router.get("/user-details", verifyUserSession, adminController.getAdminDetails);
router.put(
  "/user-profile",
  upload.single("image"),
  verifyUserSession,
  adminController.updateProfileData
);

module.exports = router;
