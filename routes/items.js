var express = require("express");
var router = express.Router();
const { verifyUserSession } = require("../middlewares/auth");
const itemsController = require("../controllers/items");
const upload = require("../middlewares/multer");

router.get("/", verifyUserSession, itemsController.getItems);
router.get("/:id", verifyUserSession, itemsController.getItem);
router.post(
  "/",
  upload.single("itemImages"),
  verifyUserSession,
  itemsController.addItem
);
router.put(
  "/:id",
  upload.single("itemImages"),
  verifyUserSession,
  itemsController.updateItem
);
router.delete("/:id", verifyUserSession, itemsController.deleteItem);

module.exports = router;
