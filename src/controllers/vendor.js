const mongoose = require("mongoose");
const Vendor = require("../models/vendor");
const Zone = require("../models/zone");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const path = "./uploads/vendors/";

mongoose.set("useFindAndModify", false);

exports.getVendors = (req, res, next) => {
  Vendor.find()
    .exec((err, result) => {
      if(err || !result){
        return res.status(500).json({
          message: "Fetch Failed"
        })
      }

      return res.status(200).json({
        result: result
      })
    })
};

exports.createVendors = async (req, res, next) => {
  var photoFile;
  var signFile;
  console.log(req.files);
  const id = mongoose.Types.ObjectId();
  var photo = req.files["photo"][0];
  var signature = req.files["signature"][0];
  if (photo) {
    photoFile = id + "_pic" + photo.detectedFileExtension;
    try {
      await pipeline(
        photo.stream,
        fs.createWriteStream(`${__dirname}/../../uploads/vendors/${photoFile}`)
      );
    } catch (err) {
      console.log(err);
    }
  }
  if (signature) {
    signFile = id + "_sign" + signature.detectedFileExtension;
    try {
      await pipeline(
        signature.stream,
        fs.createWriteStream(`${__dirname}/../../uploads/vendors/${signFile}`)
      );
    } catch (err) {
      console.log(err);
    }
  }

  // console.log(req.body);
  const vendor = new Vendor({
    _id: id,
    name: req.body.name,
    address: req.body.address,
    status: req.body.status,
    zoneCode: req.body.zoneCode,
    email: req.body.email,
    class: req.body.class,
    phone: req.body.phone,
    photo: photoFile ? `${photoFile}` : "no-photo",
    signature: signFile ? `${signFile}` : "no-signature",
    code: req.body.code,
    cumulativeAmt: req.body.cumulativeAmt,
  });
  vendor
    .save()
    .then((_) => {
      Zone.findOneAndUpdate(
        { zoneCode: req.body.zoneCode },
        { $push: { vendors: id } },
        {
          new: true,
        }
      )
        .then((response) => {
          res.status(200).json({
            message: "Vendor created!",
            data: response,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.updateVendor = async (req, res, next) => {
  const id = req.params.vendorId;
  var photoFile;
  var signFile;
  console.log(req.files);
  var photo = req.files["photo"][0];
  var signature = req.files["signature"][0];
  if (photo) {
    photoFile = id + "_pic" + photo.detectedFileExtension;
    try {
      await pipeline(
        photo.stream,
        fs.createWriteStream(`${__dirname}/../../uploads/vendors/${photoFile}`)
      );
    } catch (err) {
      console.log(err);
    }
  }
  if (signature) {
    signFile = id + "_sign" + signature.detectedFileExtension;
    try {
      await pipeline(
        signature.stream,
        fs.createWriteStream(`${__dirname}/../../uploads/vendors/${signFile}`)
      );
    } catch (err) {
      console.log(err);
    }
  }
  var updateOps = req.body;
  if (photoFile) {
    updateOps = {
      ...updateOps,
      photo: photoFile,
    };
  }
  console.log(updateOps);
  if (signFile) {
    updateOps = {
      ...updateOps,
      signature: signFile,
    };
  }
  console.log(updateOps);
  Vendor.findByIdAndUpdate(req.params.vendorId, updateOps)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.deleteVendor = (req, res, next) => {
  Notification.remove({ _id: req.params.vendorId })
    .then((result) => res.json({ message: "Vendor Removed Successfully!" }))
    .catch((error) => res.status(500).json({ error }));
};
