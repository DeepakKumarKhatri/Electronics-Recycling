var express = require('express');
var router = express.Router();
const authController = require("../controllers/auth");

router.get('/register', authController.register);

module.exports = router;
