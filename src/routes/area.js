const express = require("express");
const router = express.Router();

const areaController = require("../controllers/area");

router.get("/getAreas", areaController.getAreas);
router.post("/createArea", areaController.createArea);
router.get("/:areaId", areaController.getAreaById);
router.patch("/updateArea", areaController.updateArea);

module.exports = router;
