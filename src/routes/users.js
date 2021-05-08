const express = require("express");
const auth = require("../middleware/auth");
const multer = require("multer");
const router = express.Router();
const upload = multer();
const userController = require("../controllers/users");

router.post("/signup", upload.single("file"), userController.create_a_user);

router.post("/login", userController.login);

router.delete("/:userid", userController.delete_a_user);

router.post("/getUser", userController.getUserDetails);

router.get("/logout", auth, userController.logout);

router.post("/findUsersInZone", userController.findUsersInZone);

router.post("/changePassByUser", auth, userController.changePassByUser);

router.post("/changePassByAdmin", userController.changePassByAdmin);

router.patch("/:userId", upload.single("file"), userController.updateUser);

router.get("/getAllUsers", userController.getAllUsers);

module.exports = router;
