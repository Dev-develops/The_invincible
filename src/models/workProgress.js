const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  perDayProgress: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      approvedByTech: Boolean,
      approvedByEngineer: Boolean,
      approvedByJe: Boolean,
      dateOfEntry: Date,
      instructionToContractor: String,
      saftey: String,
      hinderance: String,
      detailsOfWork: String,
      weather: String,
      numberOfLabours: Number,
      progress: Number,
      status:String,
      workPermitted:String,
      materialUsed: [{
        name:String,
        unit:String,
        consumed:Number,
        quantity:Number
      }],
      machineryUsed:[{
        typeOfMachine:String,
        name:String,
        quantity:Number
      }],
      technicalDoc:[{
        url:String
      }],
      sitePhoto:[{
        url:String
      }]
  }
],
materialCummulatives:[{
  _id: mongoose.Schema.Types.ObjectId,
  cummulative: {type:Number,default:0}
}],
totalProgress:Number
})

module.exports = mongoose.model("Progress", progressSchema);
