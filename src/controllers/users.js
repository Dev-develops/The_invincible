const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Zone = require("../models/zone");
const vendor = require("../models/vendor");

const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const path = "./uploads/userPics/";

function isInteger(value) {
  return /^\d+$/.test(value);
}
exports.create_a_user = (req, res, next) => {
  User.find({ email: req.body.email }).then((data) => {
    if (data.length >= 1) {
      return res.status(409).json({
        message: "Email exists!",
      });
    } else {
      bcrypt.hash(req.body.password, 8, async (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          var fileName;
          const file = req.file;
          try {
            if (file) {
              if (
                file.detectedFileExtension !== ".jpg" &&
                file.detectedFileExtension !== ".jpeg" &&
                file.detectedFileExtension !== ".png"
              ) {
                throw "Invalid File Format";
              }
              const name = req.body.name;
              fileName = name + file.detectedFileExtension;
              await pipeline(
                file.stream,
                fs.createWriteStream(
                  `${__dirname}/../../uploads/userPics/${fileName}`
                )
              );
            }
          } catch (err) {
          }

          const user = new User({
            _id: mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
            name: req.body.name,
            status: req.body.status,
            designation: req.body.designation,
            userCode: req.body.userCode,
            photo: fileName ? `${fileName}` : "no-photo",
            areaAndZone: JSON.parse(req.body.areaAndZone),
            mobileNo: req.body.mobileNo,
          });
          user
            .save()
            .then((data) => {
              res.json({
                message: "User created!",
                id: data._id,
                email: data.email,
              });
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    }
  });
};

exports.delete_a_user = (req, res, next) => {
  User.remove({ _id: req.params.userid })
    .then((data) => {
      res.json({
        message: "User removed successfully!",
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({
        error: "something went wrong!",
      });
    });
};

exports.login = (req, res, next) => {
  var token;
  User.find({
    $or: [
      { email: req.body.email },
      { userCode: !isInteger(req.body.email) ? -1 : req.body.email },
    ],
  })
  .then((user) => {
    if (user.length < 1) {
      return res.status(401).json({
        message: "Auth failed! Here",
      });
    }
    if(user[0].designation === "SAP" && req.body.password === user[0].password){
      token = jwt.sign({
          email: user[0].email,
          userId: user[0]._id,
        },
        process.env.JWT_KEY || "key");
        res.cookie("jwt", token,{
          httpOnly: true
        });
        if (user[0].status !== "Removed") {
          return res.json({
            _id: user[0]._id,
            designation: user[0].designation,
            name: user[0].name,
            areaAndZone: user[0].areaAndZone,
            email: user[0].email,
            message: "Success!",
            mobileNo: user[0].mobileNo,
            status: user[0].status,
            userCode: user[0].userCode,
            photo: user[0].photo,
          });
        }else{
          return res.status(401).json({
            message: "Auth failed!"
          });
      }   
    } else {
      bcrypt.compare(req.body.password, user[0].password, function(err, re){
        if(err){
          return res.status(400).json({
            message: "Error"
          })
        }
        else if(re){
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY || "key"
          );
          res.cookie("jwt", token,{
            httpOnly: true
          });
          if (user[0].status !== "Removed") {
            return res.json({
              _id: user[0]._id,
              designation: user[0].designation,
              name: user[0].name,
              areaAndZone: user[0].areaAndZone,
              email: user[0].email,
              message: "Success!",
              mobileNo: user[0].mobileNo,
              status: user[0].status,
              userCode: user[0].userCode,
              photo: user[0].photo,
            });
          }
        } else{
          return res.status(401).json({
            message: "Auth failed!"
          });
        }
      })
    }
  })
  .catch((e) => {
    res.status(500).json({
      error: "something went wrong!",
      e
    });
  })
}

exports.getUserDetails = (req, res, next) => {
  User.find({ email: req.body.email })
    .populate("areaAndZone.area")
    .populate("areaAndZone.zones")
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed!",
        });
      }
      res.send(user);
    })
    .catch((e) => {
      res.status(500).json({
        err: e,
      });
    });
};

exports.logout = (req, res, next) => {
  res.clearCookie("jwt");
  res.json({ message: "Success!" });
};

exports.findUsersInZone = (req, res, next) => {
  User.find()
    .populate("areaAndZone.area")
    .populate("areaAndZone.zones")
    .then((data) => {
      let gm_dgm = [];
      let engineer = [];
      let je = [];
      let technician = [];
      Zone.find({ _id: req.body.zoneId })
        .populate("vendors", "name status cumulativeAmt status code", null, {
          sort: { cumulativeAmt: 1 },
        })
        .then((zone) => {
          data.map((user) => {
            user.areaAndZone.map((area) => {
              area.zones.map((zone) => {
                if (req.body.zoneId == zone._id) {
                  switch (user.designation) {
                    case "GM/DGM":
                      gm_dgm.push({ _id: user._id, name: user.name });
                      break;
                    case "Engineer":
                      engineer.push({ _id: user._id, name: user.name });
                      break;
                    case "Jr. Engineer":
                      je.push({ _id: user._id, name: user.name });
                      break;
                    case "Technician":
                      technician.push({ _id: user._id, name: user.name });
                      break;
                    default:
                      break;
                  }
                }
              });
            });
          });
          res.send({
            gm_dgm,
            engineer,
            je,
            technician,
            vendors: zone[0].vendors,
          });
        });
    })
    .catch((e) => {
      res.send(e);
    });
};

exports.changePassByUser = (req, res, next) => {
  const userData = req.userData;
  bcrypt.hash(req.body.password, 8, (err, hash) => {
    User.findByIdAndUpdate(userData.userId, { $set: { password: hash } })

      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  });
};

exports.changePassByAdmin = (req, res, next) => {
  bcrypt.hash(req.body.password, 8, (err, hash) => {
    User.findByIdAndUpdate(req.body.userId, { $set: { password: hash } })
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  });
};

exports.updateUser = async (req, res, next) => {
  console.log(req.file);
  var fileName;
  const file = req.file;
  try {
    if (file) {
      if (
        file.detectedFileExtension !== ".jpg" &&
        file.detectedFileExtension !== ".jpeg" &&
        file.detectedFileExtension !== ".png"
      ) {
        throw "Invalid File Format";
      }
      const name = req.body.name;
      fileName = name + file.detectedFileExtension;
      await pipeline(
        file.stream,
        fs.createWriteStream(`${__dirname}/../../uploads/userPics/${fileName}`)
      );
    }
  } catch (err) {
    console.log(err);
  }

  const id = req.params.userId;
  console.log(id);
  var updateOps;
  if (fileName) {
    updateOps = {
      ...req.body,
      photo: fileName ? `${fileName}` : "no-photo",
      areaAndZone: JSON.parse(req.body.areaAndZone),
    };
  } else {
    if (req.body.areaAndZone) {
      updateOps = {
        ...req.body,
        areaAndZone: JSON.parse(req.body.areaAndZone),
      };
    } else {
      updateOps = { ...req.body };
    }
  }
  console.log(updateOps);
  User.updateMany({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => res.status(500).json(err));
};

exports.getAllUsers = (req, res, next) => {
  User.find()
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      console.log(e);
      res.send(e);
    });
};
