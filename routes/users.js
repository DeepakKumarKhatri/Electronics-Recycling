var express = require("express");
var router = express.Router();
const { verifyUserSession } = require("../middlewares/auth");
const userController = require("../controllers/user");
const upload = require("../middlewares/multer");

router.get("/user-details", verifyUserSession, userController.getUserDetails);
router.put(
  "/user-profile",
  upload.single("image"),
  verifyUserSession,
  userController.updateProfileData
);

module.exports = router;
