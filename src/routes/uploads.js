const multer = require("multer");
const express = require("express");
const router = express.Router();
const upload = multer();
const uploadController = require("../controllers/uploads");

router.post("/techdocs", upload.single("file"), uploadController.techdocs);
// router.post("/userpic", upload.single("file"), uploadController.userpics);

module.exports = router;
