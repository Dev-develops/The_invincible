const mongoose = require("mongoose");

const areaSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  areaName: {
    type: String,
    required: true,
  },
  zones: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
    },
  ],
  installations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Installation",
    },
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Area", areaSchema);
