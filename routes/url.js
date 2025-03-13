const express = require("express");
const urlController = require("../controllers/urlMatchController");

const router = express.Router();

router.get("/", urlController.getAllUrls);
router.get("/:id", urlController.getUrlById);
router.post("/", urlController.createUrl);
router.put("/:id", urlController.updateUrl);
router.delete("/:id", urlController.deleteUrl);

module.exports = router;
