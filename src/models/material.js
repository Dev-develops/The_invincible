const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  unit: {
    type: String,
  },
  details: {
    type: String,
    default: "no-details.jpg",
  },
});

module.exports = mongoose.model("Material", materialSchema);
