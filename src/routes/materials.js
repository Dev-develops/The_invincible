const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const materialController = require("../controllers/materials");

router.get("/getMaterialList", materialController.getMaterialList);
router.post(
  "/createMaterial",
  upload.single("file"),
  materialController.createMaterial
);
router.patch(
  "/editMaterial/:id",
  upload.single("file"),
  materialController.editMaterial
);
router.delete("/deleteMaterial/:id", materialController.deleteMaterial);
router.get("/materialDetails/:id", materialController.materialDetails);

module.exports = router;
