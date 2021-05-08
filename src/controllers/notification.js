const mongoose = require("mongoose");

const Notification = require("../models/notification");
const zone = require("../models/zone");
const notification = require("../models/notification");
const { json } = require("express");

const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const path = "./uploads/notifications/";

exports.get_all_notifications = (req, res, next) => {
  Notification.find({})
    .populate("area", "areaName")
    .populate("installation", "name")
    .exec()
    .then((result) => res.status(201).json(result))
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.get_notification_by_area = (req, res, next) => {
  Notification.find({
    area: { $in: req.body.area },
  })
    .populate("area", "areaName")
    .populate("installation", "name")
    .exec()
    .then((result) => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch((error) => res.status(500).json(error));
};

exports.get_notification_by_id = (req, res, next) => {
  console.log(req.params);
  Notification.find({ _id: req.params.notificationId })
    .populate("area", "areaName")
    .populate("installation", "name")
    .then((result) => res.status(201).json(result))
    .catch((error) => res.status(500).json(error));
};

exports.create_notification = async (req, res, next) => {
  var fileName;
  console.log(req.file);
  const file = req.file;
  if (file) {
    const name = req.body.notificationNumber;
    fileName = name + file.detectedFileExtension;
    try {
      await pipeline(
        file.stream,
        fs.createWriteStream(
          `${__dirname}/../../uploads/notifications/${fileName}`
        )
      );
    } catch (err) {
      console.log(err);
    }
  }
  console.log(req.body);
  const notification = new Notification({
    _id: mongoose.Types.ObjectId(),
    area: req.body.area,
    installation: req.body.installation,
    projectType: req.body.projectType,
    notificationNumber: req.body.notificationNumber,
    projectId: req.body.projectId,
    date: req.body.date,
    uploadNotification: fileName ? `/notifications/${fileName}` : "no-details",
    description: req.body.description,
    nameRequisitioner: req.body.nameRequisitioner,
    departmentRequisitioner: req.body.departmentRequisitioner,
    phNumberRequisitioner: req.body.phNumberRequisitioner,
    isJob: req.body.isjob,
  });
  notification
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Notification Created!",
        data: result,
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.delete_notification = (req, res, next) => {
  Notification.findOneAndDelete({ _id: req.params.notificationId })
    .then((resp) => {
      if (resp.uploadNotification !== "no-details") {
        fs.unlink(`./uploads${resp.uploadNotification}`, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          //file removed
        });
      }
      res.json({ message: "Notification Removed Successfully!" });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.updateNotification = async (req, res, next) => {
  var fileName;
  console.log(req.body);
  console.log(req.file);
  const file = req.file;
  if (file) {
    const name = req.body.notificationNumber;
    fileName = name + file.detectedFileExtension;
    try {
      await pipeline(
        file.stream,
        fs.createWriteStream(
          `${__dirname}/../../uploads/notifications/${fileName}`
        )
      );
    } catch (err) {
      console.log(err);
    }
  }
  const id = req.params.notificationId;
  var updateOps;
  if (fileName) {
    updateOps = {
      ...req.body,
      uploadNotification: fileName
        ? `/notifications/${fileName}`
        : "no-details",
    };
  } else {
    updateOps = req.body;
  }
  Notification.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
