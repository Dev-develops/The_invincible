const mongoose = require("mongoose");

const machinerySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    default: "no-details.jpg",
  },
});

module.exports = mongoose.model("Machinery", machinerySchema);
