const mongoose = require("mongoose");
const Area = require("../models/area");

exports.getAreas = (req, res, next) => {
  Area.find()
    .populate("zones")
    .populate("installations", "name")
    .exec((err, result) => {
      if(err || !result){
        return res.status(500).json({
          message: "Fetch Failed"
        })
      }

      return res.status(201).json({
        result
      })
    })
};

exports.createArea = (req, res, next) => {
  const area = new Area({
    _id: mongoose.Types.ObjectId(),
    areaName: req.body.areaName,
  });
  area
    .save()
    .then((response) => {
      res.status(200).json({
        message: "Area created!",
        data: response,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.getAreaById = (req, res, next) => {
  const areaId = req.params.areaId;
  Area.findById(areaId)
    .populate("installations", "name")
    .populate("zones", "zoneName")
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.updateArea = (req,res,next)=>{
  const areaId = req.body._id;
  const areaName = req.body.name;
  Area.findByIdAndUpdate(areaId,{areaName:areaName})
  .then((response) => {
    res.status(200).json(response);
  })
  .catch((err) => {
    res.status(500).json(err);
  });
};

