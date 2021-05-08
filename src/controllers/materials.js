const mongoose = require("mongoose");
const Material = require("../models/material");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const path = "./uploads/material/";

// Get all materials
exports.getMaterialList = (req, res, next) => {
  Material.find()
    .exec()
    .then((result) => res.status(201).json(result))
    .catch((err) =>
      res.status(500).json({
        error: err,
      })
    );
};

//Add a new material
exports.createMaterial = async (req, res, next) => {
  var fileName;
  console.log(req.file);
  const id = mongoose.Types.ObjectId();
  const file = req.file;
  try {
    if (file) {
      const name = id;
      fileName = name + file.detectedFileExtension;

      await pipeline(
        file.stream,
        fs.createWriteStream(`${__dirname}/../../uploads/material/${fileName}`)
      );
    }

    const material = new Material({
      _id: id,
      description: req.body.description,
      code: req.body.code,
      unit: req.body.unit,
      details: fileName ? `${fileName}` : "no-details",
    });
    material.save().then((response) => {
      res.status(200).json({
        message: "Material Created",
        data: response,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

//fetch a material by id
exports.materialDetails = (req, res, next) => {
  Material.findById(req.params.id)
    .exec()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Material not found!",
        error: err,
      });
    });
};

//delete a material by id
exports.deleteMaterial = (req, res, next) => {
  Material.findOneAndDelete({ _id: req.params.id })
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
      res.json({ message: "Material Removed Successfully!" });
    })
    .catch((error) => res.status(500).json({ error }));
};

//edit a materail by id
exports.editMaterial = async (req, res, next) => {
  var fileName;
  console.log(req.file);
  const file = req.file;
  try {
    if (file) {
      const name = req.params.id;
      fileName = name + file.detectedFileExtension;

      await pipeline(
        file.stream,
        fs.createWriteStream(`${__dirname}/../../uploads/material/${fileName}`)
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
    Material.findByIdAndUpdate(req.params.id, updateOps, {
      new: true,
    }).then((response) => {
      res.status(200).json({
        message: "Material Updated",
        data: response,
      });
    });
  } catch (err) {
    res.status(500).json({
      message: "Material not found!",
      error: err,
    });
  }
};
