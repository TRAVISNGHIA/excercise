const express = require("express");
const resultController = require("../controllers/resultController");

const router = express.Router();

router.get("/", resultController.getAllResults);
router.get("/:id", resultController.getResultById);
router.post("/", resultController.createResult);
router.put("/:id", resultController.updateResult);
router.delete("/:id", resultController.deleteResult);

module.exports = router;
