const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer();
const machineryController = require("../controllers/machinery");

router.get("/getMachineryList", machineryController.getMachineryList);
router.post(
  "/createMachinery",
  upload.single("file"),
  machineryController.createMachinery
);
router.get("/machineryDetails/:id", machineryController.machineryDetails);
router.delete("/deleteMachinery/:id", machineryController.deleteMachinery);
router.patch(
  "/editMachinery/:id",
  upload.single("file"),
  machineryController.editMachinery
);

module.exports = router;
