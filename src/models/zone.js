const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  zoneName: {
    type: String,
    required: true,
    unique: true,
  },
  zoneCode: {
    type: Number,
    required: true
  },
  vendors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
  ],
});

module.exports = mongoose.model("Zone", zoneSchema);
