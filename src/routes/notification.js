const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer();

const notificationController = require("../controllers/notification");

router.get(
  "/getAllNotifications",
  notificationController.get_all_notifications
);
router.get("/:notificationId", notificationController.get_notification_by_id);
router.post(
  "/getNotificationByArea",
  notificationController.get_notification_by_area
);
router.post(
  "/createNotification",
  upload.single("file"),
  notificationController.create_notification
);
router.patch(
  "/:notificationId",
  upload.single("file"),
  notificationController.updateNotification
);
router.delete("/:notificationId", notificationController.delete_notification);

module.exports = router;
