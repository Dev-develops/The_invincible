const mongoose = require("mongoose");
const Installation = require("../models/installation");
const Area = require("../models/area");

exports.create_installation = (req, res, next) => {
  const id = mongoose.Types.ObjectId();
  const installation = new Installation({
    _id: id,
    name: req.body.name,
    area: req.body.area,
  });
  installation
    .save()
    .then((result) => {
      Area.findOneAndUpdate(
        { _id: req.body.area },
        { $push: { installations: id } }
      )
        .then((response) => {
          res.status(201).json({
            message: "Installation Created!",
            result,
          });
        })
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};

exports.get_all_installations = (req, res, next) => {
  Installation.find({})
    .populate("area", "areaName")
    .exec()
    .then((result) => res.status(200).json(result))
    .catch((error) => res.status(500).json(error));
};

exports.update_installation = (req, res, next) => {
  const updates = ["name", "area"];
  console.log(req.body);
  Installation.findOne({ _id: req.params.id })
    .then((result) => {
      updates.forEach((update) => {
        result[update] = req.body[update];
      });
      console.log(result);
      result
        .save()
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};

exports.delete_installation = (req, res, next) => {
  Installation.remove({ _id: req.params.id })
    .then((result) =>
      res.json({ message: "Installation Removed Successfully!" })
    )
    .catch((error) => res.status(500).json({ error }));
};
