const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  area: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Area",
  },
  installation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Installation",
  },
  projectType: { type: String, required: true },
  notificationNumber: { type: String, required: true, unique: true},
  uploadNotification: { type: String },
  projectId: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  nameRequisitioner: { type: String, required: true },
  departmentRequisitioner: { type: String, required: true },
  phNumberRequisitioner: { type: Number, required: true },
  isJob: { type: Boolean, required: true },
});

module.exports = mongoose.model("Notification", notificationSchema);
