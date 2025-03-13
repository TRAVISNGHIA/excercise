const keywordsController = require("../controllers/keywordsController");
const router = require("express").Router();

router.get("/", keywordsController.getAllKeywords);

router.post("/", keywordsController.createKeyword);

router.put("/:id", keywordsController.updateKey);

router.delete("/:id", keywordsController.deleteKey);

module.exports = router;
