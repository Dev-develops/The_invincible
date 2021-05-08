const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer();

const vendorController = require("../controllers/vendor");

router.get("/getVendors", vendorController.getVendors);
router.post(
  "/createVendors",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  vendorController.createVendors
);
router.patch(
  "/:vendorId",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  vendorController.updateVendor
);

module.exports = router;
