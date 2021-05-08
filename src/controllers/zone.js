const mongoose = require("mongoose");
const Zone = require("../models/zone");
const Area = require("../models/area");

exports.getZones = (req, res, next) => {
  Zone.find()
    .exec()
    .then((result) => res.status(201).json(result))
    .catch((err) =>
      res.status(500).json({
        error: err,
      })
    );
};

exports.createZone = (req, res, next) => {
  Zone.findOne({ zoneCode: req.body.zoneCode }).then((zone) => {
    console.log(zone);
  });
  const id = mongoose.Types.ObjectId();
  const zone = new Zone({
    _id: id,
    zoneName: req.body.zoneName,
    zoneCode: req.body.zoneCode,
  });
  zone
    .save()
    .then((resp) => {
      Area.findByIdAndUpdate(req.body.areaId, { $push: { zones: id } }).then(
        (response) => {
          res
            .status(200)
            .json({
              message: "Zone created!",
              data: response,
            })
            .catch((err) => {
              res.status(500).json({
                error: err,
              });
            });
        }
      );
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.deleteZone = (req, res, next) => {
  Zone.remove({_id:req.body.id})
    .then((data)=>{
      console.log(data);
      res.json({
        message: "Zone deleted successfully!"
      })
    })
    .catch((e)=>{
      res.status(500).json({
        error:"something went wrong!"
      });
    });
};

exports.getZoneById = () => {
  const zoneId = req.params.id;
  Zone.findById(zoneId)
    .populate("vendors")
    .then((zone) => {
      res.status(200).json(zone);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.updateZone = (req,res,next)=>{
  const zoneId = req.body._id;

  Zone.findByIdAndUpdate(zoneId,{$set:req.body})
  .then((response) => {
    res.status(200).json(response);
  })
  .catch((err) => {
    res.status(500).json(err);
  });
};