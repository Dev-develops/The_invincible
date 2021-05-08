const mongoose = require("mongoose");
const Project = require("../models/project");
const Notification = require("../models/notification");
const Id = require("../models/id");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

exports.getProjectListAreaWise = (req, res, mext) => {
  let areaIds = req.body.areaIds;

  Project.find({ area: { $in: areaIds } })
    .populate("vendor")
    .populate("zone")
    .populate("area")
    .populate("technician")
    .populate("progress", "totalProgress")
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.send(e);
    });
};
exports.getProjectList = (req, res, next) => {
  Project.find()
    .populate("zone", "zoneName")
    .populate("area", "areaName")
    .populate("technician", "name")
    .populate("installation")
    .populate("jrEngineer", "name")
    .populate("engineer", "name")
    .populate("vendor")
    .populate("progress")
    .populate("materials.material")
    .populate("detailMaterials.material")
    .exec((err, result) => {
      if(err || result){
        return res.status(500).json({
          error: err,
        })
      }

      return res.status(200).json({
        result
      })
    })
};

exports.intiateProjectId = (req, res, next) => {
  const id = new Id({
    _id: mongoose.Types.ObjectId(),
    id: "main",
    projectId: 1,
  });
  id.save()
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((e) => {
      console.log(e);
      res.send(e);
    });
};
exports.createProject = (req, res, next) => {
      let temp = new Date().getTime();

      let newNum = parseFloat(temp) + 1;
      temp = "0".repeat(5 - temp.length) + temp;
      console.log(temp);
      req.body.projectId = "CIV/JOB/" + temp;

      const project = new Project({
        _id: mongoose.Types.ObjectId(),
        projectType: req.body.projectType,
        projectId: req.body.projectId,
        state: req.body.state,
        description: req.body.description,
        notificationNo: req.body.notificationNo,
        installation: req.body.installation,
        notification: req.body.notification,
        area: req.body.area,
        zone: req.body.zone,
        vendor: req.body.vendor,
        dos: req.body.dos,
        doc: req.body.doc,
        adc: req.body.doc,
        technician: req.body.technician,
        engineer: req.body.engineer,
        jrEngineer: req.body.jrEngineer,
        estimate: req.body.estimate,
        drawing: req.body.drawing,
        prNumber: req.body.prNumber,
        poNumber: req.body.poNumber,
        validityLLC: req.body.validityLLC,
        subcontractorName: req.body.subcontractorName,
        subcontractorNumber: req.body.subcontractorNumber,
        remarks: req.body.remarks,
        jobCertificate: false,
      });

      project
        .save()
        .then((response) => {
          Notification.findOneAndUpdate(
            { notificationNumber: req.body.notificationNo },
            { isJob: true }
          )
            .then((resp) => {
              return res.status(200).json(response);
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json(err);
            });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({
            error: err,
          });
        });
};

exports.projectDetails = (req, res, next) => {
  Project.findById(req.query.projectId)
    .populate("zone", "zoneName zoneCode")
    .populate("area", "areaName")
    .populate("technician", "name")
    .populate("jrEngineer", "name")
    .populate("engineer", "name")
    .populate("vendor", "name address code")
    .populate("vendor")
    .populate("notification", "description")
    .populate("progress")
    .populate("installation")
    .populate("materials.material")
    .populate("detailMaterials.material")
    .exec()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Project not found!",
        error: err,
      });
    });
};

exports.getProjectsForUser = (req, res, next) => {
  Project.find({
    $or: [
      { technician: req.body.userId },
      { engineer: req.body.userId },
      { jrEngineer: req.body.userId },
    ],
  })
    .populate("vendor")
    .populate("zone")
    .populate("area")
    .populate("technician")
    .populate("progress", "totalProgress")
    .populate("installation")
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.addMaterial = (req, res, next) => {
  Project.findById(req.body.projectId)
    .then((project) => {
      let flag = false;
      project.detailMaterials.push({
        material: req.body.materialId,
        reservationNo: req.body.reservationNo,
        quantity: req.body.quantity,
        date: req.body.date,
      });
      project.materials.map((e) => {
        console.log(e.material);
        if (e.material == req.body.materialId) {
          flag = true;
          e["cummulative"] = e["cummulative"] + req.body.quantity;
        }
      });
      if (!flag) {
        project.materials.push({
          material: req.body.materialId,
          cummulative: req.body.quantity,
        });
      }
      project
        .save()
        .then((resp) => {
          res.status(200).json(resp);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.deleteProject = (req, res, next) => {
  const id = req.params.projectId;
  Project.findOneAndUpdate({ _id: id }, { state: "Removed" })
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.editProject = (req, res, next) => {
  const id = req.params.projectId;
  const updateOps = req.body;
  Project.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.showCause = (req, res, next) => {
  const id = req.params.id;
  const update = req.body;
  console.log(id, update);
  Project.updateMany({ _id: id }, { $set: update })
    .exec()
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.uploadEstimate = async (req, res, next) => {
  console.log(req.file);
  let fileName;
  const file = req.file;
  try {
    if (file) {
      const projectId = req.body.projectId;
      fileName = projectId + new Date().getTime() + file.detectedFileExtension;
      await pipeline(
        file.stream,
        fs.createWriteStream(
          `${__dirname}/../../uploads/projects/estimate/${fileName}`
        )
      );

      Project.findOneAndUpdate(
        { _id: req.body.projectId },
        { $push: { estimate: fileName } }
      )
        .then((resp) => {
          res.status(200).json(resp);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.uploadDrawing = async (req, res, next) => {
  console.log(req.file);
  let fileName;
  const file = req.file;
  try {
    if (file) {
      const projectId = req.body.projectId;
      fileName = projectId + new Date().getTime() + file.detectedFileExtension;
      await pipeline(
        file.stream,
        fs.createWriteStream(
          `${__dirname}/../../uploads/projects/drawing/${fileName}`
        )
      );

      Project.findOneAndUpdate(
        { _id: req.body.projectId },
        { $push: { drawing: fileName } }
      )
        .then((resp) => {
          res.status(200).json(resp);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.deleteDrawing = (req, res, next) => {
  console.log(req.body.file);
  console.log(req.body.projectId);
  Project.findOneAndUpdate(
    { _id: req.body.projectId },
    { $pullAll: { drawing: [req.body.file] } }
  )
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.deleteEstimate = (req, res, next) => {
  console.log(req.body.file);
  console.log(req.body.projectId);
  Project.findOneAndUpdate(
    { _id: req.body.projectId },
    { $pullAll: { estimate: [req.body.file] } }
  )
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.deleteMaterial = (req, res, next) => {
  Project.findById(req.body.projectId)
    .then((project) => {
      let materialName;
      let quantity;
      project.detailMaterials.map((material) => {
        if (material._id == req.body.materialId) {
          materialName = material.material;
          quantity = material.quantity;
        }
      });
      let detailedMaterial = project.detailMaterials.filter(
        (mat) => mat._id != req.body.materialId
      );
      project.detailMaterials = [...detailedMaterial];
      project.materials.map((material) => {
        if (material.material.toString() === materialName.toString()) {
          console.log("matched");
          material.cummulative =
            parseInt(material.cummulative) - parseInt(quantity);
        }
      });
      let changedMaterials = project.materials.filter(
        (mat) => mat.cummulative != 0
      );
      project.materials = [...changedMaterials];
      project
        .save()
        .then((resp) => {
          res.status(200).json(resp);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};
