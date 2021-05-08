const express = require("express");
const router = express.Router();

const installationController = require("../controllers/installation");

router.get("/allInstallations", installationController.get_all_installations);
router.post("/createInstallation", installationController.create_installation);
router.patch(
  "/updateInstallation/:id",
  installationController.update_installation
);
router.delete(
  "/deleteInstallation/:id",
  installationController.delete_installation
);
module.exports = router;
