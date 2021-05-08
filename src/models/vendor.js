const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  zoneCode: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    default: "no-photo.jpg",
    required: true,
  },
  signature: {
    type: String,
    default: "no-signature.jpg",
    required: true,
  },
  code: {
    type: Number,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },

  class: {
    type: String,
    required: true,
  },
  cumulativeAmt: {
    type: Number,
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
});

module.exports = mongoose.model("Vendor", vendorSchema);
