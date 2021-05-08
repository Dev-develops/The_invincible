const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  projectType: {
    type: String,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  notificationNo: {
    type: String,
    required: true,
  },
  installation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Installation",
  },
  notification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notification",
  },
  area: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Area",
  },
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Zone",
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },
  subcontractorName: {
    type: String,
  },
  subcontractorNumber: {
    type: Number,
  },
  dos: {
    type: Date,
    required: true,
  },
  doc: {
    type: Date,
    required: true,
  },
  adc: {
    type: Date,
    required: true,
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  engineer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  jrEngineer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  estimate: [],
  drawing: [],
  prNumber: {
    type: Number,
  },
  poNumber: {
    type: Number,
  },
  validityLLC: {
    type: Date,
  },
  remarks: {
    type: String,
  },
  progress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Progress",
  },
  workOrder: {
    workContent: {
      type: String,
    },
    workOrderDate: {
      type: Date,
    },
    workOrderNumber: {
      type: String,
    },
  },
  showcause: {
    type: Boolean,
    default: false,
  },
  showcauseDate: {
    type: Date,
  },
  showcauseData: {
    type: String,
    default: "",
  },
  jobCertificate: {
    type: Boolean,
  },
  jobComp: {
    type: Boolean,
  },
  recName: {
    type: String,
  },
  recCom: {
    type: String,
  },
  materials: [
    {
      material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
      },
      cummulative: Number,
    },
  ],
  detailMaterials: [
    {
      material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
      },
      quantity: Number,
      reservationNo: String,
      date: Date,
    },
  ],
});

module.exports = mongoose.model("Project", projectSchema);
