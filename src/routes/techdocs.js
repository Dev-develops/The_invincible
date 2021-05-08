const express = require("express");
const router = express.Router();

const techdocsController = require("../controllers/techdocs");

router.get("/getDocs", techdocsController.getDocs);
router.delete("/deleteDocs/:id/:name", techdocsController.deleteDocs);

module.exports = router;
