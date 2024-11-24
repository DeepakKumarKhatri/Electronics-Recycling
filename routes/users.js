var express = require("express");
var router = express.Router();
const { verifyUserSession } = require("../middlewares/auth");
const userController = require("../controllers/user");

/* GET users listing. */
router.get("/", verifyUserSession, function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/user-details", userController.getUserDetails);
router.get("/user-profile", userController.profileData);
router.put("/user-profile", userController.updateProfileData);

module.exports = router;
