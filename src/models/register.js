const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  date: {
    type: Date,
    required: true,
  },
  deliveryNoteNumber: {
    type: String,
  },
  reservationNumber: {
    type: String,
  },
  gatePassNumber: {
    type: String,
  },
  quantityIn: {
    type: Number,
  },
  quantityOut: {
    type: Number,
  },
  unit: {
    type: String,
    required: true,
  },
  job: {
    type: String,
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Vendor",
  },
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Material",
  },
  machinery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Machinery",
  },
  remark: { type: String },
});

module.exports = mongoose.model("Register", registerSchema);
