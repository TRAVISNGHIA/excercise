const express = require("express");
const resultLogController = require("../controllers/resultLogController");

const router = express.Router();

router.get("/", resultLogController.getAllLogs);
router.get("/:id", resultLogController.getLogById);
router.post("/", resultLogController.createLog);
router.put("/:id", resultLogController.updateLog);
router.delete("/:id", resultLogController.deleteLog);

module.exports = router;
