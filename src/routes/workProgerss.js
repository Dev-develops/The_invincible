const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer();
const workProgressControllers = require("../controllers/workProgress");
const workProgress = require("../models/workProgress");

router.post("/addWorkProgress", workProgressControllers.addWorkProgress);

router.patch(
  "/updateWorkProgress/:progressId",
  workProgressControllers.updateWorkProgress
);

router.get(
  "/getWorkProgress/:progressId",
  workProgressControllers.getWorkProgress
);

router.post("/updateVerified", workProgressControllers.updateVerfied);

router.post("/extend", workProgressControllers.extend);

router.patch("/tally/techDoc/:dayId/:progressId",upload.single("file"),workProgressControllers.addTechDoc)

router.post("/tally/techDoc/:progressId/:dayId",workProgressControllers.deleteTechDoc)

router.patch("/tally/sitePhoto/:dayId/:progressId",upload.single("file"),workProgressControllers.addSitePhoto)

router.post("/tally/sitePhoto/:progressId/:dayId",workProgressControllers.deleteSitePhoto)

module.exports = router;
