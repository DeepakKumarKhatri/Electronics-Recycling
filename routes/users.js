var express = require("express");
var router = express.Router();
const { verifyUserSession } = require("../middlewares/auth");

/* GET users listing. */
router.get("/", verifyUserSession, function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
