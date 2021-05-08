const mongoose = require("mongoose");
const Machinery = require("../models/machinery");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const path = "./uploads/machinery/";

//Get all Machinery
exports.getMachineryList = (req, res, next) => {
  Machinery.find()
    .exec()
    .then((result) => res.status(201).json(result))
    .catch((err) =>
      res.status(500).json({
        error: err,
      })
    );
};

//Add a machinery
exports.createMachinery = async (req, res, next) => {
  var fileName;
  const id = mongoose.Types.ObjectId();
  console.log(req.file);
  const file = req.file;
  try {
    if (file) {
      const name = id;
      fileName = name + file.detectedFileExtension;

      await pipeline(
        file.stream,
        fs.createWriteStream(`${__dirname}/../../uploads/machinery/${fileName}`)
      );
    }

    const machinery = new Machinery({
      _id: id,
      description: req.body.description,
      details: fileName ? `${fileName}` : "no-details",
    });
    machinery.save().then((response) => {
      res.status(200).json(response);
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

//fetch a machinery by id
exports.machineryDetails = (req, res, next) => {
  Machinery.findById(req.params.id)
    .exec()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Machinery not found!",
        error: err,
      });
    });
};

//delete a machinery by id
exports.deleteMachinery = (req, res, next) => {
  Machinery.findOneAndDelete({ _id: req.params.id })
    .then((resp) => {
      if (resp.details !== "no-details") {
        fs.unlink(`${path}${resp.details}`, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          //file removed
        });
      }
      res.json({ message: "Machinery Removed Successfully!" });
    })
    .catch((error) => res.status(500).json({ error }));
};

//edit a machinery by id
exports.editMachinery = async (req, res, next) => {
  var fileName;
  console.log(req.file);
  const file = req.file;
  try {
    if (file) {
      const name = req.params.id;
      fileName = name + file.detectedFileExtension;

      await pipeline(
        file.stream,
        fs.createWriteStream(`${__dirname}/../../uploads/machinery/${fileName}`)
      );
    }
    var updateOps;
    if (fileName) {
      updateOps = {
        ...req.body,
        details: fileName,
      };
    } else {
      updateOps = req.body;
    }
    Machinery.findByIdAndUpdate(req.params.id, updateOps, {
      new: true,
    }).then((response) => {
      res.status(200).json({
        message: "Machinery Updated",
        data: response,
      });
    });
  } catch (err) {
    res.status(500).json({
      message: "Machinery not found!",
      error: err,
    });
  }
};
