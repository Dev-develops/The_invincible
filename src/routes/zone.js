const express = require("express");
const router = express.Router();

const zoneController = require("../controllers/zone");

router.get("/getZones", zoneController.getZones);
router.post("/createZone", zoneController.createZone);
router.get("/getZone/:id", zoneController.getZoneById);
router.patch("/updateZone", zoneController.updateZone);
router.post("/deleteZone", zoneController.deleteZone);

module.exports = router;
