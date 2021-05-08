const Project = require("../models/project");
const Progress = require("../models/workProgress");
const mongoose = require("mongoose");

const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const path = "./uploads/userPics/";
exports.addWorkProgress = (req, res, next) => {
  let start = new Date(req.body.dos);
  let end = new Date(req.body.doc);
  let perDayProgress = [];
  for (let x = start; x <= end; x.setDate(x.getDate() + 1)) {
    const y = x.toISOString();
    console.log(y);
    let temp = {
      _id: mongoose.Types.ObjectId(),
      approvedByEngineer: false,
      approvedByJe: false,
      approvedByTech: false,
      dateOfEntry: y,
      instructionToContractor: "",
      saftey: "",
      hinderance: "",
      detailsOfWork: "",
      weather: "",
      numberOfLabours: 0,
      progress: 0,
      materialUsed: [],
      machineryUsed: [],
    };
    perDayProgress.push(temp);
  }
  let progressId = mongoose.Types.ObjectId();
  const progress = new Progress({
    _id: progressId,
    perDayProgress: perDayProgress,
    materialCummulatives: [],
    totalProgress: 0,
  });
  progress
    .save()
    .then((resp) => {
      Project.findByIdAndUpdate(req.body.projectId, { progress: progressId })
        .then((project) => {
          res.status(200).json(project);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    })
    .catch((e) => {
      res.status(500).json({
        error: e,
      });
    });
};

exports.updateWorkProgress = (req, res, next) => {
  const id = req.params.progressId;
  const updateOps = req.body;
  Progress.update({ _id: id }, { $set: updateOps })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: "Unable to update" });
    });
};

exports.updateVerfied = (req, res, next) => {
  const progressId = req.body.progressId;
  const dayId = req.body.dayId;
  const type = req.body.type;
  Progress.findById(progressId)
    .then((progress) => {
      progress.perDayProgress.map((resp) => {
        console.log(resp._id);
        if (resp._id == dayId) {
          console.log(resp._id);
          resp[type] = true;
        }
      });
      progress
        .save()
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.getWorkProgress = (req, res, next) => {
  const id = req.params.progressId;
  Progress.findOne({ _id: id })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

exports.extend = (req,res,next) =>{
  let start = new Date(req.body.from);
  let end = new Date(req.body.to);
  start =new Date(start.setDate(start.getDate()+1))
  end = new Date(end.setDate(end.getDate()))
  console.log(start)
  console.log(end)
  let perDayProgress = [];
  for (let x = start; x < end; x.setDate(x.getDate() + 1)) {
    const y = x.toISOString();
    let temp = {
      _id: mongoose.Types.ObjectId(),
      approvedByEngineer: false,
      approvedByJe: false,
      approvedByTech: false,
      dateOfEntry: y,
      instructionToContractor: "",
      saftey: "",
      hinderance: "",
      detailsOfWork: "",
      weather: "",
      numberOfLabours: 0,
      progress: 0,
      materialUsed: [],
      machineryUsed: [],
    };
    perDayProgress.push(temp);
  }
  console.log(perDayProgress)
  console.log(end)
  Progress.findOne({_id:req.body.progressId}).then(data=>{
    Progress.findOneAndUpdate({_id:req.body.progressId},{perDayProgress:data.perDayProgress.concat(perDayProgress)}).then(response=>{
      Project.findOneAndUpdate({_id:req.body.projectId},{adc:end}).then(finalRes=>{
        console.log(finalRes)
        res.send(response)
      })
    })
  }).catch(e=>{
    res.send(e)
  })
}

exports.addTechDoc = async (req,res,next) =>{
  let fileName
  const file = req.file
  try{
    if(file){
      fileName = "projectTechDoc"+new Date().getTime() + file.detectedFileExtension;
      // console.log(file)
      await pipeline(
        file.stream,
        fs.createWriteStream(`${__dirname}/../../uploads/tally/${fileName}`)
      )
    }
  }catch(e){
    console.log(e)
  }
  if(fileName){
    Progress.find({_id:req.params.progressId}).then(res1=>{
      let data = res1[0].perDayProgress
      data.map(day=>{
        if(day._id==req.params.dayId){
          console.log("here")
          day.technicalDoc.push({url:"/tally/"+fileName})
        }
      })
      // console.log(data)
      Progress.updateMany({_id:req.params.progressId},{perDayProgress:data}).then(finalResp=>{
        return res.status(200).send("Done")
      })
    }).catch(e=>{
      console.log(e)
      return res.status(500).send({err:"Error"})
    })
  }
}

exports.addSitePhoto = async (req,res,next) =>{
  let fileName
  const file = req.file
  try{
    if(file){
      fileName = "projectSitePhoto"+new Date().getTime() + file.detectedFileExtension;
      // console.log(file)
      await pipeline(
        file.stream,
        fs.createWriteStream(`${__dirname}/../../uploads/tally/${fileName}`)
      )
    }
  }catch(e){
    console.log(e)
  }
  if(fileName){
    Progress.find({_id:req.params.progressId}).then(res1=>{
      let data = res1[0].perDayProgress
      data.map(day=>{
        if(day._id==req.params.dayId){
          day.sitePhoto.push({url:"/tally/"+fileName})
        }
      })
      // console.log(data)
      Progress.updateMany({_id:req.params.progressId},{perDayProgress:data}).then(finalResp=>{
        return res.status(200).send()
      })
    }).catch(e=>{
      console.log(e)
      return res.status(500).send({err:"Error"})
    })
  }
}

exports.deleteTechDoc = (req,res,next) =>{
  console.log(req.body)
  Progress.find({_id:req.params.progressId}).then(data=>{
    data[0].perDayProgress.map(day=>{
      if(day._id == req.params.dayId){
        day.technicalDoc = day.technicalDoc.filter(doc=>{
          return doc.url != req.body.url 
        })
      }
    })
    Progress.findByIdAndUpdate(req.params.progressId,{perDayProgress:data[0].perDayProgress}).then(data2=>{
      const day = data[0].perDayProgress.filter(day=>{
        return day._id == req.params.dayId
      })
      return res.send(day)
    })
  }).catch(e=>{
    res.send("Error")
  })
}

exports.deleteSitePhoto = (req,res,next) =>{
  console.log(req.body)
  Progress.find({_id:req.params.progressId}).then(data=>{
    data[0].perDayProgress.map(day=>{
      if(day._id == req.params.dayId){
        day.sitePhoto = day.sitePhoto.filter(doc=>{
          return doc.url != req.body.url 
        })
      }
    })
    Progress.findByIdAndUpdate(req.params.progressId,{perDayProgress:data[0].perDayProgress}).then(data2=>{
      const day = data[0].perDayProgress.filter(day=>{
        return day._id == req.params.dayId
      })
      return res.send(day)
    })
  }).catch(e=>{
    res.send("Error")
  })
}