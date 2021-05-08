const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project");
const multer = require("multer");
const upload = multer();

router.get("/getProjectList", projectController.getProjectList);
router.post("/createProject", projectController.createProject);
router.get("/projectDetails", projectController.projectDetails);
router.post("/getUserProjects", projectController.getProjectsForUser);
router.post("/addMaterial", projectController.addMaterial);
router.delete("/deleteProject/:projectId", projectController.deleteProject);
router.patch("/editProject/:projectId", projectController.editProject);
router.patch("/showCause/:id", projectController.showCause);
router.post("/init", projectController.intiateProjectId);
router.post("/getByAreas", projectController.getProjectListAreaWise);
router.post(
  "/uploadEstimate",
  upload.single("file"),
  projectController.uploadEstimate
);
router.post(
  "/uploadDrawing",
  upload.single("file"),
  projectController.uploadDrawing
);
router.post("/deleteDrawing", projectController.deleteDrawing);
router.post("/deleteEstimate", projectController.deleteEstimate);
router.post("/deleteMaterial", projectController.deleteMaterial);
module.exports = router;
